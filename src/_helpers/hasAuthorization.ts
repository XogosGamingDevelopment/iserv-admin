import { roleDefinitions } from "../constants/roleDefinitions";
import { getUserInfo } from "../_helpers/getUserInfo";

export const hasAuthorization = (action: string, module: string): boolean => {
  const role = getUserInfo("rolename");
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