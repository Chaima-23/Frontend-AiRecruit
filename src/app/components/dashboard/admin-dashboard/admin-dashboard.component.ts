import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminDashboardService } from '../../../core/services/admin-dashboard.service';
import { AuthRedirectService } from '../../../core/services/Auth-redirect.service';
import { UserModel } from '../../../models/idm/user.model';
import { CandidateModel } from '../../../models/idm/candidate.model';
import { RecruiterModel } from '../../../models/idm/recruiter.model';
import { FullTimeJobModel } from '../../../models/offers/full-time-job.model';
import { PartTimeJobModel } from '../../../models/offers/part-time-job.model';
import { InternshipOfferModel } from '../../../models/offers/internship-offer.model';
import { OfferModel } from '../../../models/offers/offer.model';
import { JobOfferModel } from '../../../models/offers/job-offer.model';

// Component Metadata
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements AfterViewInit {
  // Job Listings
  jobs = [
    { title: 'UI/UX Designer', type: 'Job', applications: 125, status: 'Active', statusClass: 'active' },
    { title: 'Full Stack Dev', type: 'Remote', applications: 100, status: 'Expired', statusClass: 'expired' },
    { title: 'DevOps', type: 'Internship', applications: 5, status: 'Active', statusClass: 'active' },
    { title: 'Android Dev', type: 'Job', applications: 45, status: 'Active', statusClass: 'active' },
    { title: 'iOS Developer', type: 'Internship', applications: 36, status: 'Expired', statusClass: 'expired' }
  ];

  // Component Properties
  Offers: (OfferModel | JobOfferModel | FullTimeJobModel | PartTimeJobModel | InternshipOfferModel)[] = [];
  settingsForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  logoutMessage: string | null = null;
  currentView: string = 'dashboard';
  stats: any[] = [];
  candidatesByGender: any = { Females: 0, Males: 0 };
  registeredByCountry: { [key: string]: number } = {};
  selectedOffer: OfferModel | null = null;
  selectedFullTimeJob: FullTimeJobModel | null = null;
  selectedPartTimeJob: PartTimeJobModel | null = null;
  selectedInternshipOffer: InternshipOfferModel | null = null;
  currentOfferIndex: number = 0;
  adminName: string = 'Admin';
  candidates: CandidateModel[] = [];
  selectedCandidate: CandidateModel | null = null;
  currentCandidateIndex: number = 0;
  recruiters: RecruiterModel[] = [];
  selectedRecruiter: RecruiterModel | null = null;
  currentRecruiterIndex: number = 0;

  @ViewChild('candidatesChart') candidatesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('registeredChart') registeredCanvas!: ElementRef<HTMLCanvasElement>;
  private candidatesChart: Chart | null = null;
  private registeredChart: Chart | null = null;

  // Constructor and Initialization
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private adminDashboardService: AdminDashboardService,
    private authRedirectService: AuthRedirectService
  ) {
    Chart.register(...registerables);
    const userInfo = this.authRedirectService.getUserInfo();
    console.log('User Info:', userInfo);
    this.updateAdminName(userInfo);
    this.settingsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
    if (this.currentView === 'candidates') {
      this.loadCandidates();
    } else if (this.currentView === 'recruiters') {
      this.loadRecruiters();
    }
  }

  ngAfterViewInit(): void {
    if (this.currentView === 'dashboard') {
      this.loadDashboardStats();
    }
  }

  // Data Loading Methods
  loadCandidates(): void {
    this.adminDashboardService.getAllCandidates().subscribe({
      next: (data: CandidateModel[]) => {
        this.candidates = data.map(candidate => ({
          ...candidate,
          dateOfBirth: candidate.dateOfBirth ? new Date(candidate.dateOfBirth) : null,
          experience: candidate.yearsOfExperience || 0,
          techSkills: candidate.technicalSkills || ''
        }));
        if (this.candidates.length > 0 && this.currentCandidateIndex >= 0) {
          this.selectedCandidate = this.candidates[this.currentCandidateIndex];
        }
      },
      error: (error) => {
        console.error('Error fetching candidates:', error);
      }
    });
  }

  loadRecruiters(): void {
    this.adminDashboardService.getAllRecruiters().subscribe({
      next: (data: RecruiterModel[]) => {
        this.recruiters = data;
      },
      error: (error) => {
        console.error('Error fetching recruiters:', error);
      }
    });
  }

  loadDashboardStats(): void {
    this.adminDashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = [
          { title: 'Job Posts', value: data.totalJobOffers || 0 },
          { title: 'Internship Posts', value: data.totalInternshipOffers || 0 },
          { title: 'Total Applications', value: data.totalApplications || 0 },
          { title: 'Total Candidates', value: data.totalCandidates || 0 },
          { title: 'Total Recruiters', value: data.totalRecruiters || 0 }
        ];
        this.candidatesByGender = data.candidatesByGender || { Females: 0, Males: 0 };
        this.registeredByCountry = data.registeredByCountry || {};
        this.initializeCharts();
      },
      error: (error) => {
        console.error('Error fetching dashboard stats:', error);
        this.stats = [
          { title: 'Job Posts', value: 0 },
          { title: 'Internship Posts', value: 0 },
          { title: 'Total Applications', value: 0 },
          { title: 'Total Candidates', value: 0 },
          { title: 'Total Recruiters', value: 0 }
        ];
        this.candidatesByGender = { Females: 0, Males: 0 };
        this.registeredByCountry = {};
        this.initializeCharts();
      }
    });
  }

  initializeCharts(): void {
    if (this.candidatesChart) this.candidatesChart.destroy();
    if (this.registeredChart) this.registeredChart.destroy();

    if (this.candidatesCanvas && this.candidatesCanvas.nativeElement) {
      this.candidatesChart = new Chart(this.candidatesCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Females', 'Males'],
          datasets: [{
            label: 'Number of Candidates',
            data: [this.candidatesByGender.Females, this.candidatesByGender.Males],
            backgroundColor: ['#FF6384', '#36A2EB'],
            borderWidth: 0.5
          }]
        },
        options: {
          cutout: '70%',
          plugins: { legend: { display: false } }
        }
      });
    }

    if (this.registeredCanvas && this.registeredCanvas.nativeElement) {
      const countryLabels = Object.keys(this.registeredByCountry);
      const countryData = countryLabels.map(country => this.registeredByCountry[country]);

      this.registeredLegend = countryLabels.map((country, index) => ({
        label: country,
        value: this.registeredByCountry[country],
        color: this.getColor(index)
      }));

      if (countryLabels.length > 0) {
        this.registeredChart = new Chart(this.registeredCanvas.nativeElement, {
          type: 'doughnut',
          data: {
            labels: countryLabels,
            datasets: [{
              label: 'Number of Registered',
              data: countryData,
              backgroundColor: countryLabels.map((_, index) => this.getColor(index)),
              borderWidth: 0.5
            }]
          },
          options: {
            cutout: '70%',
            plugins: { legend: { display: false } }
          }
        });
      }
    }
  }

  private colorPalette: string[] = [
    '#40E0D0', '#00CED1', '#87CEEB', '#ADD8E6', '#B0E0E6', '#AFEEEE', '#6495ED', '#191970'
  ];

  private getColor(index: number): string {
    return this.colorPalette[index % this.colorPalette.length];
  }

  public registeredLegend: { label: string, value: number, color: string }[] = [];

  setView(view: string): void {
    this.currentView = view;
    if (view === 'dashboard') {
      this.loadDashboardStats();
    } else if (view === 'candidates') {
      this.loadCandidates();
    } else if (view === 'recruiters') {
      this.loadRecruiters();
    } else if (view === 'settings') {
      // No specific action needed for settings view
    } else if (view === 'offers') {
      this.loadOffers();
    }
  }

  // Form Initialization with Prefilled Email
  initializeSettingsForm(userInfo: UserModel | null): void {
    const email = userInfo?.email || '';
    this.settingsForm = this.fb.group({
      email: [email, [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  // Validation of Settings Form
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword || !password ? null : { mismatch: true };
  }

  onSubmitSettings(): void {
    if (this.settingsForm.valid) {
      const formData = this.settingsForm.value;
      const userData = {
        email: formData.email,
        password: formData.password || undefined
      };

      this.adminDashboardService.updateOwnAdmin(userData).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.errorMessage = null;
          this.settingsForm.patchValue({ password: '', confirmPassword: '' });
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to update settings.';
          this.successMessage = null;
        }
      });
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
      this.successMessage = null;
    }
  }

  logout(): void {
    this.authRedirectService.logout();
    setTimeout(() => {
      this.logoutMessage = null;
    }, 3000);
  }

  viewCandidateProfile(candidate: CandidateModel): void {
    this.selectedCandidate = candidate;
    this.currentCandidateIndex = this.candidates.indexOf(candidate);
  }

  deleteCandidate(candidate: CandidateModel): void {
    if (candidate.id) {
      this.adminDashboardService.deleteCandidate(candidate.id).subscribe({
        next: (response) => {
          this.candidates = this.candidates.filter(c => c.id !== candidate.id);
          if (this.selectedCandidate && this.selectedCandidate.id === candidate.id) {
            this.currentCandidateIndex = Math.min(this.currentCandidateIndex, this.candidates.length - 1);
            this.selectedCandidate = this.candidates.length > 0 ? this.candidates[this.currentCandidateIndex] : null;
          }
          if (this.candidates.length === 0) {
            this.backToListCandidate();
          }
          alert('Candidate deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting candidate:', error);
        }
      });
    }
  }

  viewRecruiterProfile(recruiter: RecruiterModel): void {
    this.selectedRecruiter = recruiter;
    this.currentRecruiterIndex = this.recruiters.indexOf(recruiter);
  }

  deleteRecruiter(recruiter: RecruiterModel): void {
    if (recruiter.id) {
      this.adminDashboardService.deleteRecruiter(recruiter.id).subscribe({
        next: (response) => {
          this.recruiters = this.recruiters.filter(r => r.id !== recruiter.id);
          if (this.selectedRecruiter && this.selectedRecruiter.id === recruiter.id) {
            this.currentRecruiterIndex = Math.min(this.currentRecruiterIndex, this.recruiters.length - 1);
            this.selectedRecruiter = this.recruiters.length > 0 ? this.recruiters[this.currentRecruiterIndex] : null;
          }
          if (this.recruiters.length === 0) {
            this.backToListRecruiter();
          }
          alert('Recruiter deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting recruiter:', error);
          alert('Failed to delete recruiter: ' + (error.error || 'Unknown error'));
        }
      });
    }
  }

  private updateAdminName(userInfo: UserModel | null): void {
    if (userInfo) {
      this.adminName = `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || userInfo.username || 'Admin';
    }
    this.settingsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  backToListCandidate(): void {
    this.selectedCandidate = null;
  }

  backToListRecruiter(): void {
    this.selectedRecruiter = null;
  }

  backToListOffers(): void {
    this.selectedOffer = null;
  }

  previousCandidateProfile(): void {
    if (this.currentCandidateIndex > 0) {
      this.currentCandidateIndex--;
      this.selectedCandidate = this.candidates[this.currentCandidateIndex];
    }
  }

  previousRecruiterProfile(): void {
    if (this.currentRecruiterIndex > 0) {
      this.currentRecruiterIndex--;
      this.selectedRecruiter = this.recruiters[this.currentRecruiterIndex];
    }
  }

  previousOfferProfile(): void {
    if (this.currentOfferIndex > 0) {
      this.currentOfferIndex--;
      this.selectedOffer = this.Offers[this.currentOfferIndex];
    }
  }

  nextCandidateProfile(): void {
    if (this.currentCandidateIndex < this.candidates.length - 1) {
      this.currentCandidateIndex++;
      this.selectedCandidate = this.candidates[this.currentCandidateIndex];
    }
  }

  nextRecruiterProfile(): void {
    if (this.currentRecruiterIndex < this.recruiters.length - 1) {
      this.currentRecruiterIndex++;
      this.selectedRecruiter = this.recruiters[this.currentRecruiterIndex];
    }
  }

  nextOfferProfile(): void {
    if (this.currentOfferIndex < this.Offers.length - 1) {
      this.currentOfferIndex++;
      this.selectedOffer = this.Offers[this.currentOfferIndex];
    }
  }

  loadOffers(): void {
    this.adminDashboardService.getAllOffers().subscribe({
      next: (response) => {
        console.log('Offers fetched:', JSON.stringify(response.data, null, 2));
        this.Offers = response.data;
        if (this.Offers.length > 0 && this.currentOfferIndex >= 0) {
          this.selectedOffer = this.Offers[this.currentOfferIndex];
          this.setSelectedOffer(this.selectedOffer);
        }
      },
      error: (error) => {
        console.error('Error fetching offers:', error);
        this.errorMessage = 'Failed to load offers.';
      }
    });
  }
  // Type guard-based setSelectedOffer method
  setSelectedOffer(offer: OfferModel) {
    this.selectedOffer = offer;
    this.selectedFullTimeJob = null;
    this.selectedPartTimeJob = null;
    this.selectedInternshipOffer = null;

    const normalizedOfferType = offer.offerType.toLowerCase();
    if (normalizedOfferType === 'full-time') {
      this.selectedFullTimeJob = offer as FullTimeJobModel;
    } else if (normalizedOfferType === 'part-time') {
      this.selectedPartTimeJob = offer as PartTimeJobModel;
    } else if (normalizedOfferType === 'internship') {
      this.selectedInternshipOffer = offer as InternshipOfferModel;
    }
  }

  viewOffer(offer: OfferModel) {
    this.setSelectedOffer(offer);
    this.currentView = 'offers';
  }

  deleteOffer(offer: OfferModel | JobOfferModel | FullTimeJobModel | PartTimeJobModel | InternshipOfferModel): void {
    if (offer.id) {
      this.adminDashboardService.deleteOffer(offer.id).subscribe({
        next: (response) => {
          this.Offers = this.Offers.filter(o => o.id !== offer.id);
          if (this.selectedOffer && this.selectedOffer.id === offer.id) {
            this.currentOfferIndex = Math.min(this.currentOfferIndex, this.Offers.length - 1);
            this.selectedOffer = this.Offers.length > 0 ? this.Offers[this.currentOfferIndex] : null;
          }
          if (this.Offers.length === 0) {
            this.backToListOffers();
          }
          alert('Offer deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting offer:', error);
          this.errorMessage = error.error?.message || 'Failed to delete offer.';
        }
      });
    }
  }
}
