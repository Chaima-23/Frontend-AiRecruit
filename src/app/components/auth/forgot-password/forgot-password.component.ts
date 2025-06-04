import { Component } from '@angular/core';
/*import { AuthService } from '../../../core/services/auth.service';*/
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {NavbarComponent} from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports:[
    FormsModule,
    CommonModule,
    NavbarComponent,
    ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],

})
export class ForgotPasswordComponent {
  email: string = '';
  /*message: string = '';
  error: string = '';
  isSubmitting: boolean = false;

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (!this.email) {
      this.error = 'Email is required.';
      this.message = '';
      return;
    }

    this.isSubmitting = true;
    this.authService.sendResetLink(this.email).subscribe({
      next: () => {
        this.message = 'If this email exists, a reset link has been sent.';
        this.error = '';
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Something went wrong. Please try again.';
        this.message = '';
        this.isSubmitting = false;
      }
    });
  }*/
}
