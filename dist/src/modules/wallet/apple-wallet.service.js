"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppleWalletService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const node_child_process_1 = require("node:child_process");
const fs = __importStar(require("node:fs"));
const os = __importStar(require("node:os"));
const path = __importStar(require("node:path"));
const yazl_1 = require("yazl");
const wallet_config_1 = require("./wallet.config");
let AppleWalletService = class AppleWalletService {
    walletConfig;
    constructor(walletConfig) {
        this.walletConfig = walletConfig;
    }
    buildDummyCard() {
        return {
            id: 'selftest-000',
            slug: 'selftest',
            firstName: 'Self',
            lastName: 'Test',
            jobTitle: 'Diagnostic',
            company: 'DropOne',
            email: 'test@dropone.pro',
            phone: '+000000000',
        };
    }
    async selfTestBuffer() {
        return this.generatePass(this.buildDummyCard());
    }
    async selfTest() {
        const certs = this.inspectCertificates();
        try {
            const buffer = await this.selfTestBuffer();
            return {
                ok: true,
                bytes: buffer.length,
                magic: buffer.subarray(0, 4).toString('hex'),
                zipMethod: this.firstZipMethod(buffer),
                certs,
            };
        }
        catch (error) {
            return {
                ok: false,
                error: error instanceof Error ? error.message : String(error),
                certs,
            };
        }
    }
    firstZipMethod(buffer) {
        if (buffer.length < 10 || buffer.subarray(0, 4).toString() !== 'PK\u0003\u0004') {
            return 'unknown';
        }
        const method = buffer.readUInt16LE(8);
        if (method === 0)
            return 'store';
        if (method === 8)
            return 'deflate';
        return String(method);
    }
    inspectCertificates() {
        const readSubject = (filePath) => {
            try {
                const pem = fs.readFileSync(filePath, 'utf8');
                const cert = new node_crypto_1.X509Certificate(pem);
                return {
                    subject: cert.subject.replace(/\n/g, ' | '),
                    issuer: cert.issuer.replace(/\n/g, ' | '),
                    isCA: cert.ca,
                };
            }
            catch (error) {
                return { error: error instanceof Error ? error.message : String(error) };
            }
        };
        return {
            signerCert: readSubject(this.walletConfig.appleSignerCertPath),
            wwdrCert: readSubject(this.walletConfig.appleWwdrCertPath),
        };
    }
    async generatePass(card) {
        if (!this.walletConfig.isAppleConfigured()) {
            throw new common_1.BadRequestException('Apple Wallet n’est pas configuré côté serveur. Consultez WALLET_SETUP.md.');
        }
        try {
            const files = this.buildPassFiles(card);
            return await this.zipDeflate(files);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue Apple Wallet';
            throw new common_1.InternalServerErrorException(`Impossible de générer le pass Apple Wallet : ${message}`);
        }
    }
    buildPassFiles(card) {
        const fullName = `${card.firstName} ${card.lastName}`.trim() || 'DropOne';
        const subtitle = [card.jobTitle, card.company].filter(Boolean).join(' · ');
        const cardUrl = `${this.walletConfig.appPublicUrl}/cards/${card.slug}`;
        const generic = {
            primaryFields: [
                {
                    key: 'name',
                    label: 'Nom',
                    value: fullName,
                },
            ],
        };
        if (subtitle) {
            generic.secondaryFields = [
                {
                    key: 'role',
                    label: 'Poste',
                    value: subtitle,
                },
            ];
        }
        const auxiliaryFields = [];
        if (card.email) {
            auxiliaryFields.push({
                key: 'email',
                label: 'Email',
                value: card.email,
            });
        }
        if (card.phone) {
            auxiliaryFields.push({
                key: 'phone',
                label: 'Téléphone',
                value: card.phone,
            });
        }
        if (auxiliaryFields.length > 0) {
            generic.auxiliaryFields = auxiliaryFields;
        }
        const passJson = {
            formatVersion: 1,
            passTypeIdentifier: this.walletConfig.applePassTypeId,
            teamIdentifier: this.walletConfig.appleTeamId,
            organizationName: 'DropOne',
            description: `Carte DropOne — ${fullName}`,
            serialNumber: card.id,
            logoText: 'DropOne',
            foregroundColor: 'rgb(255, 255, 255)',
            backgroundColor: 'rgb(13, 13, 13)',
            labelColor: 'rgb(154, 160, 172)',
            generic,
            barcodes: [
                {
                    format: 'PKBarcodeFormatQR',
                    message: cardUrl,
                    messageEncoding: 'iso-8859-1',
                },
            ],
        };
        const files = {
            ...this.loadPassAssets(),
            'pass.json': Buffer.from(JSON.stringify(passJson), 'utf8'),
        };
        const manifest = {};
        for (const [name, content] of Object.entries(files)) {
            manifest[name] = (0, node_crypto_1.createHash)('sha1').update(content).digest('hex');
        }
        files['manifest.json'] = Buffer.from(JSON.stringify(manifest), 'utf8');
        files.signature = this.signManifest(files['manifest.json']);
        return files;
    }
    signManifest(manifest) {
        const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dropone-pkpass-'));
        const manifestPath = path.join(workDir, 'manifest.json');
        const signaturePath = path.join(workDir, 'signature');
        try {
            fs.writeFileSync(manifestPath, manifest);
            const args = [
                'smime',
                '-binary',
                '-sign',
                '-certfile',
                this.walletConfig.appleWwdrCertPath,
                '-signer',
                this.walletConfig.appleSignerCertPath,
                '-inkey',
                this.walletConfig.appleSignerKeyPath,
                '-in',
                manifestPath,
                '-out',
                signaturePath,
                '-outform',
                'DER',
            ];
            const passphrase = this.walletConfig.appleSignerKeyPassphrase;
            if (passphrase) {
                args.push('-passin', `pass:${passphrase}`);
            }
            (0, node_child_process_1.execFileSync)('openssl', args, { stdio: ['ignore', 'pipe', 'pipe'] });
            return fs.readFileSync(signaturePath);
        }
        finally {
            fs.rmSync(workDir, { recursive: true, force: true });
        }
    }
    zipDeflate(files) {
        return new Promise((resolve, reject) => {
            const zip = new yazl_1.ZipFile();
            const chunks = [];
            zip.outputStream.on('data', (chunk) => chunks.push(chunk));
            zip.outputStream.on('error', reject);
            zip.outputStream.on('end', () => resolve(Buffer.concat(chunks)));
            const ordered = Object.keys(files).sort((a, b) => {
                const rank = (name) => {
                    if (name === 'pass.json')
                        return 1;
                    if (name === 'manifest.json')
                        return 2;
                    if (name === 'signature')
                        return 3;
                    return 0;
                };
                return rank(a) - rank(b) || a.localeCompare(b);
            });
            for (const name of ordered) {
                zip.addBuffer(files[name], name, { compress: true });
            }
            zip.end();
        });
    }
    loadPassAssets() {
        const assetsDir = this.walletConfig.walletAssetsDir();
        const requiredAssets = ['icon.png'];
        const optionalAssets = [
            'icon@2x.png',
            'icon@3x.png',
            'logo.png',
            'logo@2x.png',
            'logo@3x.png',
        ];
        const missing = requiredAssets.filter((name) => !fs.existsSync(path.join(assetsDir, name)));
        if (missing.length > 0) {
            throw new common_1.BadRequestException(`Images wallet manquantes dans backend-link/wallet-assets (${missing.join(', ')}).`);
        }
        const buffers = {};
        for (const name of [...requiredAssets, ...optionalAssets]) {
            const filePath = path.join(assetsDir, name);
            if (fs.existsSync(filePath)) {
                buffers[name] = fs.readFileSync(filePath);
            }
        }
        return buffers;
    }
};
exports.AppleWalletService = AppleWalletService;
exports.AppleWalletService = AppleWalletService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [wallet_config_1.WalletConfig])
], AppleWalletService);
//# sourceMappingURL=apple-wallet.service.js.map