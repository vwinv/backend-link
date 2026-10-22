"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageWash = pageWash;
exports.hexToRgba = hexToRgba;
function pageWash(start, end) {
    const light = (relativeLuminance(start) + relativeLuminance(end)) / 2 > 0.62;
    return light
        ? {
            ink: '#1C1C1C',
            muted: 'rgba(28,28,28,0.72)',
            glass: 'rgba(255,255,255,0.38)',
            line: 'rgba(28,28,28,0.16)',
            button: '#1C1C1C',
            buttonInk: '#FFFFFF',
            track: 'rgba(28,28,28,0.16)',
        }
        : {
            ink: '#FFFFFF',
            muted: 'rgba(255,255,255,0.82)',
            glass: 'rgba(255,255,255,0.16)',
            line: 'rgba(255,255,255,0.28)',
            button: '#FFFFFF',
            buttonInk: shade(end, 0.42),
            track: 'rgba(255,255,255,0.28)',
        };
}
function hexToRgba(hex, alpha) {
    const value = hex.replace('#', '');
    const red = Number.parseInt(value.slice(0, 2), 16);
    const green = Number.parseInt(value.slice(2, 4), 16);
    const blue = Number.parseInt(value.slice(4, 6), 16);
    return `rgba(${red},${green},${blue},${alpha})`;
}
function relativeLuminance(hex) {
    const value = hex.replace('#', '');
    const channels = [0, 2, 4].map((index) => {
        const channel = Number.parseInt(value.slice(index, index + 2), 16) / 255;
        return channel <= 0.03928
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}
function shade(hex, amount) {
    const value = hex.replace('#', '');
    const mix = (index) => {
        const channel = Number.parseInt(value.slice(index, index + 2), 16);
        return Math.round(channel * (1 - amount))
            .toString(16)
            .padStart(2, '0');
    };
    return `#${mix(0)}${mix(2)}${mix(4)}`;
}
//# sourceMappingURL=public-portfolio-wash.js.map