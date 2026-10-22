export declare const PORTFOLIO_LAYOUTS: readonly ["classique", "couverture", "editorial", "galerie", "minimal", "bento", "portrait", "cartes"];
export declare const PORTFOLIO_COLORS: readonly ["bleu", "ivoire", "noir", "foret", "neon", "corail", "lagon", "lilas", "terre", "sable", "soleil", "minuit"];
export declare class SavePortfolioStyleDto {
    layout: (typeof PORTFOLIO_LAYOUTS)[number];
    color: (typeof PORTFOLIO_COLORS)[number];
}
