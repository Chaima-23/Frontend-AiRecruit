import { AuthGuardData, createAuthGuard } from 'keycloak-angular';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot,
  UrlTree } from '@angular/router';
import { inject } from '@angular/core';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  __: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  debugger
  const { authenticated, grantedRoles } = authData;
  const requiredRole = route.data['expectedRoles'];
  if (!requiredRole) {
    return false;
  }
  const hasRequiredRole = (role: string): boolean =>
    Object.values(grantedRoles.realmRoles).some((roles) =>
      roles.includes(role));
  if (authenticated && hasRequiredRole(requiredRole)) {
    return true;
  }
  const router = inject(Router);
  return router.parseUrl('/errors/unauthorized');
};
export const canActivateAuthRole =
  createAuthGuard<CanActivateFn>(isAccessAllowed);
