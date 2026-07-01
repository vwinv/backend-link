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
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  pageUrl: string;
  ogImageUrl: string;
  logoUrl: string;
  design: ResolvedProDesign;
  socialLinks: PublicSocialLink[];
};
