-- Backoffice RBAC
CREATE TABLE "admin_permissions" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_permissions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "admin_permissions_key_key" ON "admin_permissions"("key");
CREATE INDEX "admin_permissions_module_idx" ON "admin_permissions"("module");

CREATE TABLE "admin_roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "admin_roles_name_key" ON "admin_roles"("name");

CREATE TABLE "admin_role_permissions" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

ALTER TABLE "admin_role_permissions"
  ADD CONSTRAINT "admin_role_permissions_roleId_fkey"
  FOREIGN KEY ("roleId") REFERENCES "admin_roles"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "admin_role_permissions"
  ADD CONSTRAINT "admin_role_permissions_permissionId_fkey"
  FOREIGN KEY ("permissionId") REFERENCES "admin_permissions"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "users" ADD COLUMN "adminRoleId" TEXT;

CREATE INDEX "users_adminRoleId_idx" ON "users"("adminRoleId");

ALTER TABLE "users"
  ADD CONSTRAINT "users_adminRoleId_fkey"
  FOREIGN KEY ("adminRoleId") REFERENCES "admin_roles"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
