"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuperAdmin = isSuperAdmin;
exports.assertSuperAdmin = assertSuperAdmin;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const admin_permissions_catalog_1 = require("./admin-permissions.catalog");
function isSuperAdmin(actor) {
    if (actor.adminRoleName === admin_permissions_catalog_1.SUPER_ADMIN_ROLE_NAME)
        return true;
    if (actor.permissions.includes('*'))
        return true;
    return actor.role === client_1.UserRole.ADMIN && !actor.adminRoleId;
}
function assertSuperAdmin(actor) {
    if (!isSuperAdmin(actor)) {
        throw new common_1.ForbiddenException('Action réservée au Super Admin');
    }
}
//# sourceMappingURL=admin-super-admin.js.map