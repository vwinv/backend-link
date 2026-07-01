INSERT INTO "plans" (
    "id",
    "name",
    "slug",
    "description",
    "priceMonthly",
    "priceYearly",
    "maxCards",
    "maxTeamMembers",
    "hasPortfolio",
    "hasCustomDomain",
    "hasAnalytics",
    "features",
    "isActive",
    "createdAt",
    "updatedAt"
) VALUES (
    'plan_premium',
    'Link Premium',
    'premium',
    'Accès complet aux fonctionnalités Premium Link',
    4000,
    36000,
    10,
    50,
    true,
    false,
    true,
    '["portfolio","pro_designs","custom_colors","team","unlimited_scan"]',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO NOTHING;
