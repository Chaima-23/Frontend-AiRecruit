/*
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidateService } from '../../../core/services/candidate.service';
import { HttpErrorResponse } from '@angular/common/http';

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

  constructor(private router: Router, private fb: FormBuilder, private candidateService: CandidateService) {
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
    } else {
      this.stepOneForm.markAllAsTouched();
    }
  }

  submit() {
    if (this.stepOneForm.valid && this.stepTwoForm.valid) {
      const candidateData = {
        candidateDTO: {
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
        },
        userDTO: {
          username: `${this.stepOneForm.value.firstName} ${this.stepOneForm.value.lastName}`,
          email: this.stepOneForm.value.email,
          password: this.stepOneForm.value.password,
          firstName: this.stepOneForm.value.firstName,
          lastName: this.stepOneForm.value.lastName
        }
      };

      this.candidateService.registerCandidate(candidateData).subscribe({
        next: () => {
          this.successMessage = 'User Created Successfully';
          this.errorMessage = null;
          //Trigger Keycloak login page
          this.authService.loginWithCredentials(
            this.stepOneForm.value.email,
            this.stepOneForm.value.password
          ).subscribe({
            next: (response) => {
              if (response.role === 'CANDIDATE') {
                this.authService.setToken(response.accessToken, response.refreshToken);
                this.router.navigate(['/dashboard/candidate']);
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
