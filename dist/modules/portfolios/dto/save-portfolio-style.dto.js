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
exports.SavePortfolioStyleDto = exports.PORTFOLIO_COLORS = exports.PORTFOLIO_LAYOUTS = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
exports.PORTFOLIO_LAYOUTS = [
    'classique',
    'couverture',
    'editorial',
    'galerie',
    'minimal',
    'bento',
    'portrait',
    'cartes',
];
exports.PORTFOLIO_COLORS = [
    'bleu',
    'ivoire',
    'noir',
    'foret',
    'neon',
    'corail',
    'lagon',
    'lilas',
    'terre',
    'sable',
    'soleil',
    'minuit',
];
class SavePortfolioStyleDto {
    layout;
    color;
}
exports.SavePortfolioStyleDto = SavePortfolioStyleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: exports.PORTFOLIO_LAYOUTS, example: 'classique' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(exports.PORTFOLIO_LAYOUTS),
    __metadata("design:type", Object)
], SavePortfolioStyleDto.prototype, "layout", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: exports.PORTFOLIO_COLORS, example: 'neon' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(exports.PORTFOLIO_COLORS),
    __metadata("design:type", Object)
], SavePortfolioStyleDto.prototype, "color", void 0);
//# sourceMappingURL=save-portfolio-style.dto.js.map