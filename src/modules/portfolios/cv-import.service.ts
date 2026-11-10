import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PDFParse } from 'pdf-parse';
import { randomBytes } from 'crypto';

type CvDraft = {
  firstName: string;
  lastName: string;
  age: number | null;
  phone: string;
  address: string;
  hidePersonalDetails: boolean;
  title: string;
  description: string;
  experiences: {
    id: string;
    role: string;
    company: string;
    period: string;
    missions: string;
  }[];
  teachings: {
    id: string;
    title: string;
    school: string;
    year: string;
    audience: string;
  }[];
  skills: { id: string; name: string; level: number }[];
  competences: string[];
  strengths: string[];
  interests: string[];
  projects: {
    title: string;
    description: string;
    projectUrl: string;
  }[];
};

@Injectable()
export class CvImportService {
  constructor(private readonly configService: ConfigService) {}

  async extractDraftFromPdf(file: Express.Multer.File): Promise<CvDraft> {
    this.assertPdf(file);
    const text = await this.extractText(file.buffer);
    if (text.length < 40) {
      throw new BadRequestException(
        'Impossible de lire ce PDF. Utilisez un CV texte (pas un scan image).',
      );
    }
    return this.structureWithOpenAi(text.slice(0, 24000));
  }

  private assertPdf(file: Express.Multer.File) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Fichier PDF requis');
    }
    const mime = (file.mimetype || '').toLowerCase();
    const name = (file.originalname || '').toLowerCase();
    const looksPdf =
      mime === 'application/pdf' ||
      mime === 'application/x-pdf' ||
      name.endsWith('.pdf');
    if (!looksPdf) {
      throw new BadRequestException('Seuls les fichiers PDF sont acceptés');
    }
    if (file.buffer.length > 8 * 1024 * 1024) {
      throw new BadRequestException('PDF trop volumineux (max 8 Mo)');
    }
  }

  private async extractText(buffer: Buffer): Promise<string> {
    const parser = new PDFParse({ data: buffer });
    try {
      const parsed = await parser.getText();
      return (parsed.text || '').replace(/\s+/g, ' ').trim();
    } catch {
      throw new BadRequestException('PDF illisible ou corrompu');
    } finally {
      await parser.destroy().catch(() => undefined);
    }
  }

  private async structureWithOpenAi(cvText: string): Promise<CvDraft> {
    const apiKey = this.configService.get<string>('openai.apiKey', '');
    if (!apiKey) {
      throw new ServiceUnavailableException(
        'Import CV indisponible : configurez OPENAI_API_KEY.',
      );
    }
    const model =
      this.configService.get<string>('openai.model', 'gpt-4o-mini') ||
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

    let response: Response;
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
    } catch {
      throw new ServiceUnavailableException(
        'Impossible de contacter le service d’analyse CV.',
      );
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new ServiceUnavailableException(
        detail.includes('insufficient_quota')
          ? 'Quota OpenAI dépassé. Réessayez plus tard.'
          : 'Analyse du CV indisponible pour le moment.',
      );
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = payload.choices?.[0]?.message?.content?.trim() ?? '';
    if (!raw) {
      throw new BadRequestException('Aucune donnée extraite du CV');
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new BadRequestException('Réponse d’analyse CV invalide');
    }
    return this.normalizeDraft(parsed);
  }

  private normalizeDraft(raw: unknown): CvDraft {
    const source =
      raw && typeof raw === 'object' && !Array.isArray(raw)
        ? (raw as Record<string, unknown>)
        : {};
    const text = (value: unknown, max: number) => {
      if (typeof value !== 'string') return '';
      return value.trim().slice(0, max);
    };
    const id = () => randomBytes(6).toString('hex');
    const rows = (value: unknown) => (Array.isArray(value) ? value : []);
    const chips = (value: unknown, maxItems: number, maxLen: number) =>
      rows(value)
        .map((item) => text(item, maxLen))
        .filter(Boolean)
        .slice(0, maxItems);

    const ageRaw = source.age;
    let age: number | null = null;
    if (typeof ageRaw === 'number' && Number.isFinite(ageRaw)) {
      age = Math.max(1, Math.min(120, Math.round(ageRaw)));
    } else if (typeof ageRaw === 'string') {
      const n = Number.parseInt(ageRaw, 10);
      if (!Number.isNaN(n)) age = Math.max(1, Math.min(120, n));
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
          if (!item || typeof item !== 'object') return [];
          const row = item as Record<string, unknown>;
          const role = text(row.role, 120);
          if (!role) return [];
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
          if (!item || typeof item !== 'object') return [];
          const row = item as Record<string, unknown>;
          const title = text(row.title, 160);
          if (!title) return [];
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
          if (!item || typeof item !== 'object') return [];
          const row = item as Record<string, unknown>;
          const name = text(row.name, 80);
          if (!name) return [];
          const levelRaw =
            typeof row.level === 'number' ? row.level : Number(row.level);
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
          if (!item || typeof item !== 'object') return [];
          const row = item as Record<string, unknown>;
          const title = text(row.title, 80);
          if (!title) return [];
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
}
