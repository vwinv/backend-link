export type ProDesignLayout =
  | 'azurCentered'
  | 'corailGradient'
  | 'blancLight'
  | 'degradeNoir'
  | 'bubble'
  | 'arc'
  | 'nuit'
  | 'or';

export type ProDesignTemplate = {
  id: string;
  name: string;
  layout: ProDesignLayout;
  background: string;
  gradientEnd?: string;
  accent?: string;
};

export type ResolvedProDesign = ProDesignTemplate & {
  accentColor: string;
  pageBackground: string;
  textPrimary: string;
  textMuted: string;
  lightSurface: boolean;
};

export type CardThemeJson = {
  style?: string;
  showQrCode?: boolean;
  cardBadge?: string;
  proDesignId?: string | null;
  brandColor?: string | null;
  useCompanyColors?: boolean | null;
};
