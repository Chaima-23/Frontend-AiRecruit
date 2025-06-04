/*
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-signup-recruiter',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup-recruiter.component.html',
  styleUrls: ['./signup-recruiter.component.css']
})
export class SignupRecruiterComponent {
  step = 1;
  stepOneForm: FormGroup;
  stepTwoForm: FormGroup;
  isOtherField: boolean = false;
  isOtherCountry: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private recruiterService: RecruiterService,
    private cdr: ChangeDetectorRef,
  ) {
    this.stepOneForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      companyName: ['', Validators.required],
      companySize: ['', Validators.required],
      country: ['', Validators.required],
      otherCountry: [''],
      city: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
    });

    this.stepTwoForm = this.fb.group({
      phoneNumber1: ['', Validators.required],
      phoneNumber2: [''],
      webSite: [''],
      field: ['', Validators.required],
      otherField: [''],
      companyDescription: [''],
    });
  }

  onFieldChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.isOtherField = value === 'Other';
    if (!this.isOtherField) {
      this.stepTwoForm.get('otherField')?.setValue('');
      this.stepTwoForm.get('otherField')?.clearValidators();
      this.stepTwoForm.get('otherField')?.updateValueAndValidity();
    } else {
      this.stepTwoForm.get('otherField')?.setValidators(Validators.required);
      this.stepTwoForm.get('otherField')?.updateValueAndValidity();
    }
  }

  onCountryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.isOtherCountry = value === 'Other';
    if (!this.isOtherCountry) {
      this.stepOneForm.get('otherCountry')?.setValue('');
      this.stepOneForm.get('otherCountry')?.clearValidators();
      this.stepOneForm.get('otherCountry')?.updateValueAndValidity();
    } else {
      this.stepOneForm.get('otherCountry')?.setValidators(Validators.required);
      this.stepOneForm.get('otherCountry')?.updateValueAndValidity();
    }
  }

  goToSignIn(): void {
    this.router.navigate(['/auth/sign-in']);
  }

  goToHome(): void {
    this.router.navigate(['']);
  }

  nextStep(): void {
    if (this.stepOneForm.valid) {
      this.step = 2;
      this.successMessage = 'Step 1 completed successfully! Proceed to Step 2.';
      this.errorMessage = null;
      this.cdr.detectChanges();
    } else {
      this.stepOneForm.markAllAsTouched();
      this.errorMessage = 'Please fill all required fields correctly.';
      this.successMessage = null;
      this.cdr.detectChanges();
    }
  }


  submit(): void {
    if (this.stepOneForm.valid && this.stepTwoForm.valid) {
      const recruiterData = {
        firstName: this.stepOneForm.value.firstName,
        lastName: this.stepOneForm.value.lastName,
        email: this.stepOneForm.value.email,
        password: this.stepOneForm.value.password,
        companyName: this.stepOneForm.value.companyName,
        companySize: this.stepOneForm.value.companySize,
        country: this.isOtherCountry ? this.stepOneForm.value.otherCountry : this.stepOneForm.value.country,
        city: this.stepOneForm.value.city,
        addressLine1: this.stepOneForm.value.addressLine1,
        addressLine2: this.stepOneForm.value.addressLine2,
        phoneNumber1: this.stepTwoForm.value.phoneNumber1,
        phoneNumber2: this.stepTwoForm.value.phoneNumber2,
        webSite: this.stepTwoForm.value.webSite,
        field: this.isOtherField ? this.stepTwoForm.value.otherField : this.stepTwoForm.value.field,
        companyDescription:this.stepTwoForm.value.companyDescription,

      };

      this.recruiterService.registerRecruiter(recruiterData).subscribe({
        next: () => {
          this.successMessage = 'User Created Successfully';
          this.errorMessage = null;
          // Trigger Keycloak login page
          this.authService.loginWithCredentials(
            this.stepOneForm.value.email,
            this.stepOneForm.value.password
          ).subscribe({
            next: (response) => {
              if (response.role === 'RECRUITER') {
                this.authService.setToken(response.accessToken, response.refreshToken);
                this.router.navigate(['/dashboard/recruiter']);
              } else {
                this.router.navigate(['/auth/sign-in']);
              }
            },
            error: (err: HttpErrorResponse) => {
              this.errorMessage = 'Auto-login failed. Please sign in manually.';
              this.router.navigate(['/auth/sign-in']);
            }
          });
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
          this.successMessage = null;
          console.error('Registration error:', err);
        }
      });
    } else {
      this.stepTwoForm.markAllAsTouched();
      this.errorMessage = 'Please fill all required fields.';
    }
  }



}
*/
