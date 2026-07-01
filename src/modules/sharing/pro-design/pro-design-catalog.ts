import type { ProDesignTemplate } from './pro-design.types';

export const DEFAULT_PRO_DESIGN_ID = 'uni';
export const DEFAULT_UNI_BACKGROUND = '#121212';

const LEGACY_IDS: Record<string, string> = {
  azur: 'uni',
  coral: 'degrade',
};

export const PRO_DESIGN_TEMPLATES: ProDesignTemplate[] = [
  {
    id: 'uni',
    name: 'Uni',
    background: '#0A6BFF',
    layout: 'azurCentered',
  },
  {
    id: 'degrade',
    name: 'Degrade',
    background: '#FF8036',
    gradientEnd: '#FF4545',
    accent: '#FF8036',
    layout: 'corailGradient',
  },
  {
    id: 'blanc',
    name: 'Blanc',
    background: '#FFFFFF',
    accent: '#0A6BFF',
    layout: 'blancLight',
  },
  {
    id: 'degrade-noir',
    name: 'Degrade noir',
    background: '#0A4D35',
    gradientEnd: '#000000',
    accent: '#0A4D35',
    layout: 'degradeNoir',
  },
  {
    id: 'bubble',
    name: 'Bubble',
    background: '#FFFFFF',
    accent: '#0A6BFF',
    layout: 'bubble',
  },
  {
    id: 'arc',
    name: 'Arc',
    background: '#5E5CE6',
    accent: '#5E5CE6',
    layout: 'arc',
  },
  {
    id: 'nuit',
    name: 'Nuit',
    background: '#0B1A38',
    accent: '#0B1A38',
    layout: 'nuit',
  },
  {
    id: 'or',
    name: 'Or',
    background: '#141108',
    accent: '#D4A843',
    layout: 'or',
  },
];

export function getProDesignTemplate(id?: string | null): ProDesignTemplate {
  const resolvedId = id ? (LEGACY_IDS[id] ?? id) : DEFAULT_PRO_DESIGN_ID;
  const template = PRO_DESIGN_TEMPLATES.find((item) => item.id === resolvedId);
  return template ?? PRO_DESIGN_TEMPLATES[0];
}

function parseHex(hex: string): [number, number, number] {
  const normalized = hex.replace('#', '').trim();
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

function toHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((value) => Math.round(value).toString(16).padStart(2, '0'))
    .join('')}`;
}

function lerpHex(from: string, to: string, amount: number): string {
  const [r1, g1, b1] = parseHex(from);
  const [r2, g2, b2] = parseHex(to);
  return toHex(
    r1 + (r2 - r1) * amount,
    g1 + (g2 - g1) * amount,
    b1 + (b2 - b1) * amount,
  );
}

function blendTowardBlack(hex: string, amount = 0.9): string {
  return lerpHex(hex, '#000000', amount);
}

export function applyBrandColorToTemplate(
  template: ProDesignTemplate,
  brandColor: string,
): ProDesignTemplate {
  const color = brandColor.startsWith('#') ? brandColor : `#${brandColor}`;

  switch (template.layout) {
    case 'azurCentered':
      return { ...template, background: color, accent: color };
    case 'corailGradient':
      return {
        ...template,
        background: color,
        accent: color,
        gradientEnd: lerpHex(color, '#1A1A1A', 0.22),
      };
    case 'blancLight':
      return { ...template, background: '#FFFFFF', accent: color };
    case 'degradeNoir':
      return {
        ...template,
        background: color,
        accent: color,
        gradientEnd: '#000000',
      };
    case 'bubble':
      return { ...template, background: '#FFFFFF', accent: color };
    case 'arc':
      return { ...template, background: color, accent: color };
    case 'nuit':
      return { ...template, background: color, accent: color };
    case 'or':
      return {
        ...template,
        background: blendTowardBlack(color, 0.9),
        accent: color,
      };
    default:
      return template;
  }
}
