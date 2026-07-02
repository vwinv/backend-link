import type { ProDesignLayout } from './pro-design.types';

type CardStylePalette = {
  background: string;
  accent: string;
  gradientEnd?: string;
  layout: ProDesignLayout;
};

const CARD_STYLE_PALETTES: Record<string, CardStylePalette> = {
  noir: {
    background: '#121212',
    accent: '#0A6BFF',
    layout: 'azurCentered',
  },
  bleu: {
    background: '#0A6BFF',
    accent: '#3D8BFF',
    layout: 'azurCentered',
  },
  rouge: {
    background: '#E84545',
    accent: '#FF8A80',
    layout: 'azurCentered',
  },
  vert: {
    background: '#3A7A51',
    accent: '#2DBE8C',
    layout: 'azurCentered',
  },
  ambre: {
    background: '#F0A830',
    accent: '#FFB020',
    layout: 'blancLight',
  },
  blanc: {
    background: '#F3F3F5',
    accent: '#0A6BFF',
    layout: 'blancLight',
  },
};

export function getCardStylePalette(style?: string | null): CardStylePalette | null {
  if (!style?.trim()) return null;
  return CARD_STYLE_PALETTES[style.trim().toLowerCase()] ?? null;
}
