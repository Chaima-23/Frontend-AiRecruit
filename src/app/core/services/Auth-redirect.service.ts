
import {inject, Injectable} from '@angular/core';
import { Router } from '@angular/router';
import Keycloak from 'keycloak-js';
import {UserModel} from '../../models/idm/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthRedirectService {
  private readonly keycloak = inject(Keycloak);
  constructor(private router: Router) {}

  async handleRoleBasedRedirection(keycloak: Keycloak): Promise<void> {
    const tokenParsed = keycloak.tokenParsed;
    if (!tokenParsed || !tokenParsed.realm_access?.roles) {
      console.error('Unable to retrieve user roles.');
      await this.router.navigate(['/errors/unauthorized']);
      return;
    }

    const roles: string[] = tokenParsed.realm_access.roles;
debugger;
    if (roles.includes('ADMIN')) {
      await this.router.navigate(['/dashboard/admin']);
    } else if (roles.includes('RECRUITER')) {
      await this.router.navigate(['/dashboard/recruiter']);
    } else if (roles.includes('CANDIDATE')) {
      await this.router.navigate(['/dashboard/candidate']);
    } else {
      await this.router.navigate(['/errors/unauthorized']);
    }
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout({
      redirectUri: window.location.origin + '/login'
    });
  }
  // Méthode pour récupérer les informations de l'utilisateur
  getUserInfo(): UserModel | null {
    const tokenParsed = this.keycloak.tokenParsed;
    if (!tokenParsed) return null;

    return {
      id: tokenParsed['sub'] || '',
      email: tokenParsed['email'] || '',
      firstName: tokenParsed['given_name'] || '',
      lastName: tokenParsed['family_name'] || '',
      password: '',
      keycloakId: tokenParsed['sub'] || '',
      username: tokenParsed['preferred_username'] || ''
    };
  }

}
