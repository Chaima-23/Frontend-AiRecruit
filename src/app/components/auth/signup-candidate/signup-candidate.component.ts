import {ChangeDetectorRef, Component} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidateService } from '../../../core/services/candidate.service';
import { HttpErrorResponse } from '@angular/common/http';
import {AuthRedirectService} from '../../../core/services/Auth-redirect.service';

@Component({
  selector: 'app-signup-candidate',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signup-candidate.component.html',
  styleUrls: ['./signup-candidate.component.css']
})
export class SignupCandidateComponent {
  step = 1;
  stepOneForm: FormGroup;
  stepTwoForm: FormGroup;
  isOtherCountry: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private router: Router, private fb: FormBuilder, private candidateService: CandidateService, private authRedirectService: AuthRedirectService, private cdr: ChangeDetectorRef) {
    this.stepOneForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      otherCountry: [''],
      city: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });

    this.stepTwoForm = this.fb.group({
      diploma: ['', Validators.required],
      specialization: ['', Validators.required],
      yearsOfExperience: ['', [Validators.required, Validators.min(0)]],
      technicalSkills: ['', Validators.required],
      softSkills: ['', Validators.required]
    });
  }


  onCountryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.isOtherCountry = value === 'Other';  // Show custom country input if 'Other' is selected
  }

  goToHome(): void {
    this.router.navigate(['']);
  }

  goToSignIn(): void {
    this.router.navigate(['/auth/sign-in']);
  }

  nextStep() {
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

  submit() {
    if (this.stepOneForm.valid && this.stepTwoForm.valid) {
      const candidateData = {
        firstName: this.stepOneForm.value.firstName,
        lastName: this.stepOneForm.value.lastName,
        email: this.stepOneForm.value.email,
        password: this.stepOneForm.value.password,
        dateOfBirth: this.stepOneForm.value.dateOfBirth,
        gender: this.stepOneForm.value.gender,
        country: this.isOtherCountry ? this.stepOneForm.value.otherCountry : this.stepOneForm.value.country,
        city: this.stepOneForm.value.city,
        address: this.stepOneForm.value.address,
        phoneNumber: this.stepOneForm.value.phoneNumber,
        diploma: this.stepTwoForm.value.diploma,
        specialization: this.stepTwoForm.value.specialization,
        yearsOfExperience: this.stepTwoForm.value.yearsOfExperience,
        technicalSkills: this.stepTwoForm.value.technicalSkills,
        softSkills: this.stepTwoForm.value.softSkills
      };
      const payload = {
        candidateDTO: {
          dateOfBirth: candidateData.dateOfBirth,
          gender: candidateData.gender,
          country: candidateData.country,
          city: candidateData.city,
          address: candidateData.address,
          phoneNumber: candidateData.phoneNumber,
          diploma: candidateData.diploma,
          specialization: candidateData.specialization,
          yearsOfExperience: parseInt(candidateData.yearsOfExperience, 10),
          technicalSkills: candidateData.technicalSkills,
          softSkills: candidateData.softSkills
        },
        userDTO: {
          username: candidateData.email.split('@')[0],
          email: candidateData.email,
          password: candidateData.password,
          firstName: candidateData.firstName,
          lastName: candidateData.lastName
        }
      };

      this.candidateService.registerCandidate(payload).subscribe({
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

          this.successMessage = null;
        }
      });
    } else {
      this.stepTwoForm.markAllAsTouched();
      this.errorMessage = 'Please fill all required fields.';
    }
  }

}
