import { roleDefinitions } from "../constants/roleDefinitions";
import { getUserInfo } from "../_helpers/getUserInfo";

export const hasAuthorization = (action: string, module: string): boolean => {
  const role = getUserInfo("rolename");
  // Sub-admins can do everything in the dashboard except manage admin accounts, the same rule the server
  // applies (utility/adminAccess). The per-module lists in roleDefinitions are no longer used for them.
  if (role === "npo_admin" || role === "student_admin") return module !== "admin";
  const rolePermissions = roleDefinitions[role as keyof typeof roleDefinitions];
  if (!rolePermissions) return false;

  for (const permission of rolePermissions) {
    const { action: allowedActions, modules } = permission;

    const actionAllowed =
      allowedActions === "*" ||
      (Array.isArray(allowedActions) && allowedActions.includes(action));

    const moduleAllowed =
      modules === "*" ||
      (Array.isArray(modules) ? modules.includes(module) : modules === module);

    if (actionAllowed && moduleAllowed) {
      return true;
    }
  }

  return false;
};