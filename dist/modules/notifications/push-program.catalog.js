"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUSH_PROGRAM_BODIES = exports.INACTIVITY_SCHEDULE = exports.PREMIUM_MONTHLY_ROTATION = exports.INACTIVITY_WEEKLY_ROTATION = exports.WEDNESDAY_ROTATION = exports.PUSH_HOUR_TOLERANCE_MINUTES = exports.DEFAULT_PUSH_TIMEZONE = exports.PUSH_SEND_WINDOW = exports.PUSH_PROGRAM_TITLE = void 0;
exports.getPushProgramBody = getPushProgramBody;
exports.familyForMessage = familyForMessage;
exports.priorityForFamily = priorityForFamily;
exports.PUSH_PROGRAM_TITLE = 'Drop One';
exports.PUSH_SEND_WINDOW = { startHour: 8, endHour: 21 };
exports.DEFAULT_PUSH_TIMEZONE = 'Africa/Dakar';
exports.PUSH_HOUR_TOLERANCE_MINUTES = 14;
exports.WEDNESDAY_ROTATION = [7, 8, 9, 10, 19];
exports.INACTIVITY_WEEKLY_ROTATION = [1, 2, 3, 4, 5, 6];
exports.PREMIUM_MONTHLY_ROTATION = [13, 14, 15];
exports.INACTIVITY_SCHEDULE = [
    { days: 2, messageNumber: 6, hour: 19, minute: 0 },
    { days: 3, messageNumber: 3, hour: 12, minute: 30 },
    { days: 5, messageNumber: 2, hour: 18, minute: 0 },
    { days: 7, messageNumber: 4, hour: 12, minute: 30 },
    { days: 10, messageNumber: 1, hour: 8, minute: 30 },
    { days: 14, messageNumber: 5, hour: 18, minute: 0 },
];
exports.PUSH_PROGRAM_BODIES = {
    1: 'Toi tu dors, tu ne cherches pas de travail… Le boulot ne viendra pas te chercher au lit. Envoie ton portfolio 💼',
    2: 'Si ta carte dort, c’est ta vie qui dort. Réveille-la 👀',
    3: 'Ça fait 3 jours… Ta carte commence à prendre la poussière 🕸️',
    4: '7 jours sans ouvrir Drop One. On ne juge pas. Enfin… un peu 🙃',
    5: 'Ta carte est en mode avion depuis trop longtemps ✈️ Rallume-la !',
    6: 'Hier tu as dit « demain je mets ma carte à jour ». Bah c’est aujourd’hui, demain 😏',
    7: 'Ton portfolio s’ennuie tout seul dans ton téléphone. Fais-lui voir du monde 📲',
    8: 'Les opportunités ne frappent pas à la porte d’une appli fermée 🚪',
    9: 'Pas de pression… mais ton futur client est peut-être à un partage de toi 🎯',
    10: 'On ne dit rien, mais ton concurrent a déjà partagé sa carte aujourd’hui. Juste comme ça 👀',
    11: 'Ton numéro griffonné sur un bout de papier ? Sérieux ? On est en 2026 😅',
    12: 'Ta photo de profil date de quand déjà ? C’est pour un ami 📸',
    13: 'Y’a des thèmes premium tout chic qui t’attendent. Ta carte mérite mieux que ça ✨',
    14: 'Un thème premium, c’est comme une belle tenue pour un entretien. Ne viens pas en pyjama 👔',
    15: 'Ta carte est jolie. Avec un thème premium, elle serait irrésistible. On dit ça, on dit rien 💅',
    16: 'Lundi = nouvelle semaine, nouveaux contacts. Ouvre Drop One et lance la machine ☕',
    17: 'Vendredi ! Tu vas en soirée ? Garde ta carte prête, on ne sait jamais qui on rencontre 🎉',
    18: 'Ce soir, avant de dormir : une carte partagée. Demain, peut-être un client 🌙',
    19: 'Le networking, c’est comme le sport : quand tu sautes une séance, ça se voit 💪',
    20: 'Quelqu’un a regardé ta carte… Le suspense est insoutenable. Viens voir 👀',
};
function getPushProgramBody(messageNumber) {
    return exports.PUSH_PROGRAM_BODIES[messageNumber] ?? null;
}
function familyForMessage(messageNumber) {
    if (messageNumber === 20)
        return 'view';
    if (messageNumber >= 1 && messageNumber <= 6)
        return 'inactivity';
    if ([7, 8, 9, 10, 16, 17, 18, 19].includes(messageNumber))
        return 'calendar';
    return 'onboarding';
}
function priorityForFamily(family) {
    switch (family) {
        case 'view':
            return 1;
        case 'inactivity':
            return 2;
        case 'onboarding':
            return 3;
        case 'calendar':
            return 4;
    }
}
//# sourceMappingURL=push-program.catalog.js.map