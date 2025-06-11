import {Component, ChangeDetectorRef, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { HttpErrorResponse } from '@angular/common/http';
import {AuthRedirectService} from '../../../core/services/Auth-redirect.service';

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
    private authRedirectService: AuthRedirectService
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
        website: this.stepTwoForm.value.webSite,
        field: this.isOtherField ? this.stepTwoForm.value.otherField : this.stepTwoForm.value.field,
        companyDescription:this.stepTwoForm.value.companyDescription,
      };

      const payload = {
        recruiterDTO: {
          companyName: recruiterData.companyName,
          companySize: parseInt(recruiterData.companySize, 10),
          country: recruiterData.country,
          city: recruiterData.city,
          addressLine1: recruiterData.addressLine1,
          addressLine2: recruiterData.addressLine2,
          phoneNumber1: recruiterData.phoneNumber1,
          phoneNumber2: recruiterData.phoneNumber2,
          website: recruiterData.website,
          field: recruiterData.field,
          description: recruiterData.companyDescription
        },
        userDTO: {
          username: recruiterData.email.split('@')[0],
          email: recruiterData.email,
          password: recruiterData.password,
          firstName: recruiterData.firstName,
          lastName: recruiterData.lastName
        }
      };
      this.recruiterService.registerRecruiter(payload).subscribe({
        next: (response: string) => {
          this.successMessage = response;
          this.errorMessage = null;

          // Rediriger après une courte pause
          setTimeout(() => this.authRedirectService.login(), 1500);

        },
        error: (err: HttpErrorResponse) => {
          console.error('Registration error:', err);
          console.log('Raw error response:', err.error);

          if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else if (err.error?.text) {
            this.successMessage = err.error.text;
            this.errorMessage = null;
          } else if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        }
      });
    } else {
      this.stepTwoForm.markAllAsTouched();
      this.errorMessage = 'Please fill all required fields.';
    }
  }



}
