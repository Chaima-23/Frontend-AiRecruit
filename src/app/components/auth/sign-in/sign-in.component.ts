import {Component, OnInit, inject, effect} from '@angular/core';
import {FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import {CommonModule} from '@angular/common';
import Keycloak from 'keycloak-js';
import {AuthRedirectService} from '../../../core/services/Auth-redirect.service';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  templateUrl: './sign-in.component.html',
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent  implements OnInit {

  loginForm: FormGroup;
  errorMessage: string | null = null;

  private readonly keycloak = inject(Keycloak);
  private readonly router = inject(Router);


  constructor(private fb: FormBuilder, private authRedirectService: AuthRedirectService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {}

  onLogin(): void {
    this.authRedirectService.login();
  }


  goToHome(): void {
    this.router.navigate(['']);
  }
  goToForgotPassword(): void {
    this.router.navigate(['auth/forgot-password']);
  }

  goToGetStarted(): void {
    this.router.navigate(['auth/get-started']);
  }
}

