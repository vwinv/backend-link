"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveWalletCardPalette = resolveWalletCardPalette;
const card_theme_util_1 = require("../sharing/pro-design/card-theme.util");
const STYLES = {
    noir: { background: '#121212', accent: '#0A6BFF', lightTheme: false },
    bleu: { background: '#0A6BFF', accent: '#3D8BFF', lightTheme: false },
    rouge: { background: '#E84545', accent: '#FF8A80', lightTheme: false },
    vert: { background: '#3A7A51', accent: '#2DBE8C', lightTheme: false },
    ambre: { background: '#F0A830', accent: '#FFB020', lightTheme: true },
    blanc: { background: '#F3F3F5', accent: '#0A6BFF', lightTheme: true },
};
function hexToRgbCss(hex) {
    const h = hex.replace('#', '');
    const full = h.length === 3
        ? h
            .split('')
            .map((c) => c + c)
            .join('')
        : h;
    const n = Number.parseInt(full, 16);
    if (!Number.isFinite(n))
        return 'rgb(18, 18, 18)';
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgb(${r}, ${g}, ${b})`;
}
function resolveWalletCardPalette(theme) {
    const parsed = (0, card_theme_util_1.parseCardTheme)(theme);
    const styleKey = typeof parsed.style === 'string' && STYLES[parsed.style]
        ? parsed.style
        : 'noir';
    const def = STYLES[styleKey];
    const primaryTextHex = def.lightTheme ? '#121212' : '#FFFFFF';
    const secondaryTextHex = def.lightTheme ? '#4F4F50' : '#DDDDDD';
    const labelHex = def.lightTheme ? '#6B7280' : '#9AA0AC';
    return {
        styleKey,
        backgroundHex: def.background,
        accentHex: def.accent,
        primaryTextHex,
        secondaryTextHex,
        lightTheme: def.lightTheme,
        passBackground: hexToRgbCss(def.background),
        passForeground: hexToRgbCss(primaryTextHex),
        passLabel: hexToRgbCss(labelHex),
    };
}
//# sourceMappingURL=wallet-card-style.util.js.map