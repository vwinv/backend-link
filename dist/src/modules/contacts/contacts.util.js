"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_AVATAR_COLOR = void 0;
exports.buildContactInitials = buildContactInitials;
exports.buildContactSubtitle = buildContactSubtitle;
exports.resolveAvatarColor = resolveAvatarColor;
exports.formatRelativeTimeFr = formatRelativeTimeFr;
exports.toContactResponse = toContactResponse;
const AVATAR_COLORS = [
    0x0a6bff, 0x7c4dff, 0x26a69a, 0xff7043, 0x5c6bc0, 0x43a047,
];
exports.DEFAULT_AVATAR_COLOR = 0x0a6bff;
function buildContactInitials(firstName, lastName) {
    const first = firstName.trim();
    const last = lastName.trim();
    if (!first && !last)
        return '??';
    if (!last)
        return first[0]?.toUpperCase() ?? '?';
    return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
}
function buildContactSubtitle(jobTitle, company) {
    const job = jobTitle?.trim() ?? '';
    const org = company?.trim() ?? '';
    if (!job && !org)
        return '';
    if (!job)
        return org;
    if (!org)
        return job;
    return `${job} · ${org}`;
}
function resolveAvatarColor(seed, fallback = exports.DEFAULT_AVATAR_COLOR) {
    if (!seed.trim())
        return fallback;
    let hash = 0;
    for (let index = 0; index < seed.length; index += 1) {
        hash = seed.charCodeAt(index) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length] ?? fallback;
}
function formatRelativeTimeFr(date) {
    const diffMs = Date.now() - date.getTime();
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1)
        return "À l'instant";
    if (minutes < 60)
        return `Il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24)
        return `Il y a ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 7)
        return `Il y a ${days} j`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5)
        return `Il y a ${weeks} sem.`;
    const months = Math.floor(days / 30);
    if (months < 12)
        return `Il y a ${months} mois`;
    const years = Math.floor(days / 365);
    return `Il y a ${years} an${years > 1 ? 's' : ''}`;
}
function toContactResponse(contact) {
    const fullName = `${contact.firstName} ${contact.lastName}`.trim();
    return {
        id: contact.id,
        source: contact.source,
        fullName,
        initials: buildContactInitials(contact.firstName, contact.lastName),
        subtitle: buildContactSubtitle(contact.jobTitle, contact.company),
        email: contact.email,
        phone: contact.phone,
        jobTitle: contact.jobTitle,
        company: contact.company,
        linkedCardId: contact.linkedCardId,
        avatarColor: contact.avatarColor,
        addedAgo: formatRelativeTimeFr(contact.createdAt),
        sharedAgo: formatRelativeTimeFr(contact.createdAt),
        createdAt: contact.createdAt.toISOString(),
    };
}
//# sourceMappingURL=contacts.util.js.map