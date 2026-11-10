"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CvImportService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pdf_parse_1 = require("pdf-parse");
const crypto_1 = require("crypto");
let CvImportService = class CvImportService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    async extractDraftFromPdf(file) {
        this.assertPdf(file);
        const text = await this.extractText(file.buffer);
        if (text.length < 40) {
            throw new common_1.BadRequestException('Impossible de lire ce PDF. Utilisez un CV texte (pas un scan image).');
        }
        return this.structureWithOpenAi(text.slice(0, 24000));
    }
    assertPdf(file) {
        if (!file?.buffer?.length) {
            throw new common_1.BadRequestException('Fichier PDF requis');
        }
        const mime = (file.mimetype || '').toLowerCase();
        const name = (file.originalname || '').toLowerCase();
        const looksPdf = mime === 'application/pdf' ||
            mime === 'application/x-pdf' ||
            name.endsWith('.pdf');
        if (!looksPdf) {
            throw new common_1.BadRequestException('Seuls les fichiers PDF sont acceptés');
        }
        if (file.buffer.length > 8 * 1024 * 1024) {
            throw new common_1.BadRequestException('PDF trop volumineux (max 8 Mo)');
        }
    }
    async extractText(buffer) {
        const parser = new pdf_parse_1.PDFParse({ data: buffer });
        try {
            const parsed = await parser.getText();
            return (parsed.text || '').replace(/\s+/g, ' ').trim();
        }
        catch {
            throw new common_1.BadRequestException('PDF illisible ou corrompu');
        }
        finally {
            await parser.destroy().catch(() => undefined);
        }
    }
    async structureWithOpenAi(cvText) {
        const apiKey = this.configService.get('openai.apiKey', '');
        if (!apiKey) {
            throw new common_1.ServiceUnavailableException('Import CV indisponible : configurez OPENAI_API_KEY.');
        }
        const model = this.configService.get('openai.model', 'gpt-4o-mini') ||
            'gpt-4o-mini';
        const system = [
            'Tu extrais le contenu d’un CV pour préremplir un portfolio DropOne.',
            'Réponds UNIQUEMENT avec un JSON valide, sans markdown.',
            'Schéma exact:',
            '{',
            '  "firstName": string,',
            '  "lastName": string,',
            '  "age": number|null,',
            '  "phone": string,',
            '  "address": string,',
            '  "title": string,',
            '  "description": string,',
            '  "experiences": [{"role":string,"company":string,"period":string,"missions":string}],',
            '  "teachings": [{"title":string,"school":string,"year":string,"audience":string}],',
            '  "skills": [{"name":string,"level":number}],',
            '  "competences": string[],',
            '  "strengths": string[],',
            '  "interests": string[],',
            '  "projects": [{"title":string,"description":string,"projectUrl":string}]',
            '}',
            'Règles: respecter les limites (≤20 expériences/formations/skills, ≤24 chips, ≤12 projets).',
            'level entre 0 et 100 (estimer si absent). teachings = formations / diplômes / enseignements.',
            'description = bio courte 3-4 phrases. title = intitulé métier / headline.',
            'Ne invente pas de données absentes: laisse chaîne vide ou tableau vide.',
            'Langue: conserver la langue du CV.',
        ].join(' ');
        let response;
        try {
            response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model,
                    temperature: 0.2,
                    response_format: { type: 'json_object' },
                    messages: [
                        { role: 'system', content: system },
                        {
                            role: 'user',
                            content: `CV:\n${cvText}`,
                        },
                    ],
                }),
            });
        }
        catch {
            throw new common_1.ServiceUnavailableException('Impossible de contacter le service d’analyse CV.');
        }
        if (!response.ok) {
            const detail = await response.text().catch(() => '');
            throw new common_1.ServiceUnavailableException(detail.includes('insufficient_quota')
                ? 'Quota OpenAI dépassé. Réessayez plus tard.'
                : 'Analyse du CV indisponible pour le moment.');
        }
        const payload = (await response.json());
        const raw = payload.choices?.[0]?.message?.content?.trim() ?? '';
        if (!raw) {
            throw new common_1.BadRequestException('Aucune donnée extraite du CV');
        }
        let parsed;
        try {
            parsed = JSON.parse(raw);
        }
        catch {
            throw new common_1.BadRequestException('Réponse d’analyse CV invalide');
        }
        return this.normalizeDraft(parsed);
    }
    normalizeDraft(raw) {
        const source = raw && typeof raw === 'object' && !Array.isArray(raw)
            ? raw
            : {};
        const text = (value, max) => {
            if (typeof value !== 'string')
                return '';
            return value.trim().slice(0, max);
        };
        const id = () => (0, crypto_1.randomBytes)(6).toString('hex');
        const rows = (value) => (Array.isArray(value) ? value : []);
        const chips = (value, maxItems, maxLen) => rows(value)
            .map((item) => text(item, maxLen))
            .filter(Boolean)
            .slice(0, maxItems);
        const ageRaw = source.age;
        let age = null;
        if (typeof ageRaw === 'number' && Number.isFinite(ageRaw)) {
            age = Math.max(1, Math.min(120, Math.round(ageRaw)));
        }
        else if (typeof ageRaw === 'string') {
            const n = Number.parseInt(ageRaw, 10);
            if (!Number.isNaN(n))
                age = Math.max(1, Math.min(120, n));
        }
        return {
            firstName: text(source.firstName, 80) || 'Prénom',
            lastName: text(source.lastName, 80) || 'Nom',
            age,
            phone: text(source.phone, 40),
            address: text(source.address, 180),
            hidePersonalDetails: false,
            title: text(source.title, 160),
            description: text(source.description, 800),
            experiences: rows(source.experiences)
                .flatMap((item) => {
                if (!item || typeof item !== 'object')
                    return [];
                const row = item;
                const role = text(row.role, 120);
                if (!role)
                    return [];
                return [
                    {
                        id: id(),
                        role,
                        company: text(row.company, 120),
                        period: text(row.period, 80),
                        missions: text(row.missions, 240),
                    },
                ];
            })
                .slice(0, 20),
            teachings: rows(source.teachings)
                .flatMap((item) => {
                if (!item || typeof item !== 'object')
                    return [];
                const row = item;
                const title = text(row.title, 160);
                if (!title)
                    return [];
                return [
                    {
                        id: id(),
                        title,
                        school: text(row.school, 160),
                        year: text(row.year, 40),
                        audience: text(row.audience, 120),
                    },
                ];
            })
                .slice(0, 20),
            skills: rows(source.skills)
                .flatMap((item) => {
                if (!item || typeof item !== 'object')
                    return [];
                const row = item;
                const name = text(row.name, 80);
                if (!name)
                    return [];
                const levelRaw = typeof row.level === 'number' ? row.level : Number(row.level);
                const level = Number.isFinite(levelRaw)
                    ? Math.max(0, Math.min(100, Math.round(levelRaw)))
                    : 60;
                return [{ id: id(), name, level }];
            })
                .slice(0, 20),
            competences: chips(source.competences, 24, 60),
            strengths: chips(source.strengths, 24, 60),
            interests: chips(source.interests, 24, 60),
            projects: rows(source.projects)
                .flatMap((item) => {
                if (!item || typeof item !== 'object')
                    return [];
                const row = item;
                const title = text(row.title, 80);
                if (!title)
                    return [];
                return [
                    {
                        title,
                        description: text(row.description, 500),
                        projectUrl: text(row.projectUrl, 300),
                    },
                ];
            })
                .slice(0, 12),
        };
    }
};
exports.CvImportService = CvImportService;
exports.CvImportService = CvImportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CvImportService);
//# sourceMappingURL=cv-import.service.js.map