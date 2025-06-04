import { RouterOutlet } from '@angular/router';
import { Component, effect, inject } from '@angular/core';
import Keycloak, { KeycloakProfile } from 'keycloak-js';

import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  typeEventArgs,
  ReadyArgs
} from 'keycloak-angular';
import {AuthRedirectService} from './core/services/Auth-redirect.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public profile?: KeycloakProfile;
  authenticated = false;
  keycloakStatus: string | undefined;

  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  private readonly authRedirectService = inject(AuthRedirectService);

  constructor() {
    effect(() => {
      const keycloakEvent = this.keycloakSignal();
      this.keycloakStatus = keycloakEvent.type;

      if (keycloakEvent.type === KeycloakEventType.Ready) {
        this.authenticated = typeEventArgs<ReadyArgs>(keycloakEvent.args);

        // Redirection immédiate après SSO si déjà connecté
        if (this.authenticated) {
          this.authRedirectService.handleRoleBasedRedirection(this.keycloak).then();
        }
      }

      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        this.authenticated = false;
      }
    });
  }

  login() {
    this.authRedirectService.login();
  }

  logout() {
    this.authRedirectService.logout();
  }



}
