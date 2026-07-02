"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveProDesign = resolveProDesign;
const pro_design_catalog_1 = require("./pro-design-catalog");
const card_style_palette_1 = require("./card-style-palette");
const card_theme_util_1 = require("./card-theme.util");
function blendTowardBlack(hex, amount = 0.9) {
    const normalized = hex.replace('#', '');
    const channels = [
        Number.parseInt(normalized.slice(0, 2), 16),
        Number.parseInt(normalized.slice(2, 4), 16),
        Number.parseInt(normalized.slice(4, 6), 16),
    ];
    const blended = channels.map((channel) => Math.round(channel * (1 - amount)));
    return `#${blended.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}
function resolvePageBackground(template) {
    if (template.layout === 'blancLight' || template.layout === 'bubble') {
        return '#FFFFFF';
    }
    if (template.layout === 'arc') {
        return template.background;
    }
    if (template.layout === 'degradeNoir') {
        const end = template.gradientEnd ?? '#000000';
        return `linear-gradient(180deg, ${template.background} 0%, ${end} 45%, ${end} 100%)`;
    }
    if (template.gradientEnd) {
        return `linear-gradient(180deg, ${template.background} 0%, ${template.gradientEnd} 100%)`;
    }
    return template.background;
}
function resolveProDesign(theme) {
    const themeJson = (0, card_theme_util_1.resolveCardThemeForRender)(theme);
    const proDesignId = themeJson.proDesignId != null ? String(themeJson.proDesignId).trim() : '';
    const hasChosenDesign = proDesignId.length > 0 && proDesignId !== pro_design_catalog_1.DEFAULT_PRO_DESIGN_ID;
    let template = (0, pro_design_catalog_1.getProDesignTemplate)(themeJson.proDesignId);
    const brandColor = themeJson.brandColor?.trim();
    let cardStyleApplied = false;
    if (themeJson.useCompanyColors === true && brandColor) {
        template = (0, pro_design_catalog_1.applyBrandColorToTemplate)(template, brandColor);
    }
    else {
        const palette = (0, card_style_palette_1.getCardStylePalette)(themeJson.style);
        if (palette) {
            cardStyleApplied = true;
            template = {
                ...template,
                id: 'uni',
                name: 'Uni',
                background: palette.background,
                accent: palette.accent,
                gradientEnd: palette.gradientEnd,
                layout: palette.layout,
            };
        }
    }
    const background = !hasChosenDesign && !cardStyleApplied && template.id === pro_design_catalog_1.DEFAULT_PRO_DESIGN_ID
        ? pro_design_catalog_1.DEFAULT_UNI_BACKGROUND
        : template.background;
    const accentColor = template.accent ?? background;
    const lightSurface = template.layout === 'blancLight' ||
        template.layout === 'bubble' ||
        template.layout === 'arc';
    const resolvedTemplate = {
        ...template,
        background: template.layout === 'or'
            ? blendTowardBlack(accentColor, 0.9)
            : background,
    };
    return {
        ...resolvedTemplate,
        accentColor,
        pageBackground: resolvePageBackground(resolvedTemplate),
        textPrimary: lightSurface ? '#0C0D10' : '#FFFFFF',
        textMuted: lightSurface ? 'rgba(12, 13, 16, 0.62)' : 'rgba(255, 255, 255, 0.78)',
        lightSurface,
    };
}
//# sourceMappingURL=pro-design-resolver.js.map