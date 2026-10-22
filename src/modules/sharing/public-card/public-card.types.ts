import type { ResolvedProDesign } from '../pro-design/pro-design.types';

export type PublicSocialLink = {
  platform: string;
  url: string;
  label?: string | null;
};

export type PublicCardPageParams = {
  fullName: string;
  initials: string;
  subtitle: string;
  companyName?: string | null;
  teamLogoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  pageUrl: string;
  ogImageUrl: string;
  logoUrl: string;
  design: ResolvedProDesign;
  socialLinks: PublicSocialLink[];
  embed?: boolean;
  /** Fichier .vcf réel, ouvert par le téléphone. */
  vcardUrl: string;
  /** Store (App Store ou Play Store). Absent dans la WebView de l’app. */
  downloadUrl?: string | null;
  /** Identifiant numérique App Store, pour la bannière Safari. */
  appleAppId?: string | null;
  /** Lien public du portfolio, seulement avec un abonnement Portfolio valide. */
  showPortfolioLink?: boolean;
};
