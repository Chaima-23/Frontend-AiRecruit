import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthRedirectService} from '../../../core/services/Auth-redirect.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router: Router, private authRedirectService: AuthRedirectService) {}

  redirectToKeycloakLogin(): void {
    this.authRedirectService.login();
  }

  redirectToSignup() {
    this.router.navigate(['/auth/get-started']);
  }

  redirectToHome() {
    this.router.navigate(['/']);
  }
  redirectToContact() {
    this.router.navigate(['/contact']);
  }
  redirectToAbout() {
    this.router.navigate(['/about']);
  }
  redirectToOffers() {
    this.router.navigate(['/offers']);
  }
}
