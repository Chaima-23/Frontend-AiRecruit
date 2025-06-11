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


  // Job Offers
  Offers = [
    {
      title: 'Software Engineer',
      company: 'TechCorp Inc.',
      location: 'New York, NY',
      salary: '$100,000 - $120,000',
      type: 'Full-time',
      datePosted: '2023-09-01',
      applications: 50,
      status: 'Active',
      specialization: 'UI/UX Design, User Research, Prototyping, 7 Years',
      yearsOfExperience: 7,
      softSkills: 'Communication, Teamwork, Problem Solving',
      technicalSkills: 'Figma.Adobe XD. HTML, CSS. JavaScript',
      description: 'SynapseX Labs is looking for an innovative and highly skilled AI & Machine Learning Engineer to join our cutting-edge research and development team...',
      duties: 'Design, develop, and deploy AI/ML models for predictive analytics and automation. Work with deep learning frameworks (TensorFlow, PyTorch) for NLP and computer vision applications',
      qualifications: 'Engineering degree or Master’s in Computer Science, Artificial Intelligence, Data Science, or a related field. Strong programming skills in Python (NumPy, Pandas, Scikit-learn, TensorFlow, PyTorch). Experience with NLP, deep learning, and computer vision technologies'
    }
  ];


  // Component Properties

  settingsForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  logoutMessage: string | null = null;
  currentView: string = 'dashboard';
  stats: any[] = [];
  candidatesByGender: any = { Females: 0, Males: 0 };
  registeredByCountry: { [key: string]: number } = {};
  selectedOffer: any = null;
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


  //Constructor and Initialization

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

  //Data Loading Methods

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
        console.log('Fetched data:', data);
        this.stats = [
          { title: 'Job Posts', value: data.totalJobOffers || 0 },
          { title: 'Internship Posts', value: data.totalInternshipOffers || 0 },
          { title: 'Total Applications', value: data.totalApplications || 0 },
          { title: 'Total Candidates', value: data.totalCandidates || 0 },
          { title: 'Total Recruiters', value: data.totalRecruiters || 0 }
        ];
        this.candidatesByGender = data.candidatesByGender ? { ...data.candidatesByGender } : { Females: 0, Males: 0 }; // Conditional assignment
        this.registeredByCountry = data.registeredByCountry ? { ...data.registeredByCountry } : {}; // Conditional assignment
        console.log('Candidates by Gender:', this.candidatesByGender);
        console.log('Registered by Country:', this.registeredByCountry);
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
    '#40E0D0',
    '#00CED1',
    '#87CEEB',
    '#ADD8E6',
    '#B0E0E6',
    '#AFEEEE',
    '#6495ED',
    '#191970'
  ];

  private getColor(index: number): string {
    return this.colorPalette[index % this.colorPalette.length];
  }

  public registeredLegend: { label: string, value: number, color: string }[] = [];
  //Navigation and Actions

  setView(view: string): void {
    this.currentView = view;
    if (view === 'dashboard') {
      this.loadDashboardStats();
    } else if (view === 'candidates') {
      this.loadCandidates();
    }else if (view === 'recruiters') {
      this.loadRecruiters();
    }else if (view === 'settings') {
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
      // Only send password if provided (optional per backend)
      const userData = {
        email: formData.email,
        password: formData.password || undefined // Send undefined if empty
      };

      this.adminDashboardService.updateOwnAdmin(userData).subscribe({
        next: (response) => {
          console.log('Settings updated:', response);
          this.successMessage = response.message;
          this.errorMessage = null;
          this.settingsForm.patchValue({ password: '', confirmPassword: '' }); // Clear password fields
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (error) => {
          console.error('Error updating settings:', error);
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
    this.logoutMessage = 'You are logged out from your space';
    this.authRedirectService.logout();
    setTimeout(() => {
      this.logoutMessage = null;
    }, 3000);
  }

  // Afficher le profil d'un candidat
  viewCandidateProfile(candidate: CandidateModel): void {
    this.selectedCandidate = candidate;
    this.currentCandidateIndex = this.candidates.indexOf(candidate);
  }

  // Supprimer un candidat via l'API backend
  deleteCandidate(candidate: CandidateModel): void {
    if (candidate.id) {
      this.adminDashboardService.deleteCandidate(candidate.id).subscribe({
        next: (response) => {
          console.log('Candidate deleted:', response);
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

  // Afficher le profil d'un recruteur
  viewRecruiterProfile(recruiter: RecruiterModel): void {
    this.selectedRecruiter = recruiter;
    this.currentRecruiterIndex = this.recruiters.indexOf(recruiter);
  }

  // Supprimer un recruteur via l'API backend
  deleteRecruiter(recruiter: RecruiterModel): void {
    if (recruiter.id) {
      this.adminDashboardService.deleteRecruiter(recruiter.id).subscribe({
        next: (response) => {
          console.log('Recruiter deleted:', response);
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

  // Méthode pour mettre à jour le nom de l'admin
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

  // Retourner à la liste des candidats
  backToListCandidate(): void {
    this.selectedCandidate = null;
  }

  // Retourner à la liste des recruteurs
  backToListRecruiter(): void {
    this.selectedRecruiter = null;
  }

  // Retourner à la liste des offres
  backToListOffers(): void {
    this.selectedOffer = null;
  }

  // Navigation précédente
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

  // Navigation suivante
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


  // Supprimer une offre
  deleteOffer(offer: any): void {
    const index = this.Offers.indexOf(offer);
    if (index !== -1) {
      this.Offers.splice(index, 1);
      if (this.selectedOffer && this.selectedOffer.title === offer.title) {
        this.currentOfferIndex = Math.min(this.currentOfferIndex, this.Offers.length - 1);
        this.selectedOffer = this.Offers.length > 0 ? this.Offers[this.currentOfferIndex] : null;
      }
      if (this.Offers.length === 0) {
        this.backToListOffers();
      }
    }
  }
  viewOffer(offer: any): void {
    this.selectedOffer= offer;
    this.currentOfferIndex = this.Offers.indexOf(offer);
  }

}
