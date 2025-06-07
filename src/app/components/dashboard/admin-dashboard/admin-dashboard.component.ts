import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AdminDashboardService} from '../../../core/services/admin-dashboard.service';
import { AuthRedirectService } from '../../../core/services/Auth-redirect.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements AfterViewInit {

  jobs = [
    {
      title: 'UI/UX Designer',
      type: 'Job',
      applications: 125,
      status: 'Active',
      statusClass: 'active'
    },
    {
      title: 'Full Stack Dev',
      type: 'Remote',
      applications: 100,
      status: 'Expired',
      statusClass: 'expired'
    },
    {title: 'DevOps', type: 'Internship', applications: 5, status: 'Active', statusClass: 'active'},
    {
      title: 'Android Dev',
      type: 'Job',
      applications: 45,
      status: 'Active',
      statusClass: 'active'
    },
    {
      title: 'iOS Developer',
      type: 'Internship',
      applications: 36,
      status: 'Expired',
      statusClass: 'expired'
    }
  ];


  // Liste simulée de candidats
  candidates = [
    {
      name: 'Darlene Robertson',
      dob: 'March 15, 1992',
      phone: '+1 (415) 678-9012',
      email: 'darlene.robertson@gmail.com',
      country: 'United States',
      city: 'San Francisco',
      address: '123 Creative Ave, Apt 45, San Francisco, CA 94103',
      diploma: "Bachelor's Degree in Graphic Design",
      specialization: 'UI/UX Design, User Research, Prototyping, 7 Years',
      yearsOfExperience: 7,
      softSkills: 'Communication, Teamwork, Problem Solving',
      technicalSkills: 'Figma, Adobe XD, HTML, CSS, JavaScript'

    },
    {
      name: 'John Doe',
      dob: 'April 20, 1988',
      phone: '+1 (415) 123-4567',
      email: 'john.doe@example.com',
      country: 'United States',
      city: 'Los Angeles',
      address: '456 Tech St, Apt 12, Los Angeles, CA 90001',
      diploma: "Master's in Computer Science",
      specialization: 'Software Development, 5 Years',
      yearsOfExperience: 3,
      softSkills: 'Communication and Problem Solving',
      technicalSkills: 'Figma, Adobe XD, HTML, CSS, JavaScript'
    }
  ];
  // Liste simulée de recruteurs
  recruiters = [
    {
      name: 'John Smith',
      email: 'john.smith@company.com',
      companyName: 'TechCorp Inc.',
      companySize: '500-1000 employees',
      country: 'United States',
      city: 'New York',
      addressLine1: '456 Business Rd',
      addressLine2: 'Suite 200',
      phoneNumber1: '+1 (212) 555-1234',
      phoneNumber2: '+1 (212) 555-5678',
      companyWebsite: 'https://techcorp.com',
      field: 'Technology',
      companyDescription: 'TechCorp Inc. is a leading technology firm specializing in software development and IT solutions, with a focus on innovation and sustainability.'
    },
    {
      name: 'Chaima Zidi',
      email: 'chaima.zidi@company.com',
      companyName: 'ASM.',
      companySize: '500-1000 employees',
      country: 'Tunisia',
      city: 'Sfax',
      addressLine1: 'Centre Ville Sfax',
      addressLine2: 'Avenue Habib Bourguiba Tunis',
      phoneNumber1: '+1 (216) 93-124-968',
      phoneNumber2: '+1 (212) 21-012-939',
      companyWebsite: 'https://ASM.com',
      field: 'IT',
    },
  ];
  // Liste des offres
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
      description: 'SynapseX Labs is looking for an innovative and highly skilled' +
        ' AI & Machine Learning Engineer to join our cutting-edge research and development team...',
      duties: 'Design, develop, and deploy AI/ML models for predictive analytics and automation.Work with deep learning frameworks (TensorFlow, PyTorch) for NLP ' +
        'and computer vision applications',
      qualifications: 'Engineering degree or Master’s in Computer Science, Artificial Intelligence, ' +
        'Data Science, or a related field' +
        '.Strong programming skills in Python (NumPy, Pandas, Scikit-learn, TensorFlow, PyTorch)' +
        '.Experience with NLP, deep learning, and computer vision technologies'

    },
  ];

  settingsForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  logoutMessage: string | null = null;
  currentView: string = 'dashboard';
  stats: any[] = [];
  candidatesByGender: any = { Females: 0, Males: 0 };
  registeredByCountry: { [key: string]: number } = {};
  selectedCandidate: any = null;
  selectedRecruiter: any = null;
  selectedOffer: any = null;
  currentCandidateIndex: number = 0;
  currentRecruiterIndex: number = 0;
  currentOfferIndex: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private adminDashboardService: AdminDashboardService,
    private authRedirectService: AuthRedirectService
  ) {
    // Formulaire pour les paramètres
    this.settingsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, {validators: this.passwordMatchValidator});
  }

  ngAfterViewInit(): void {
    if (this.currentView === 'dashboard') {
      this.loadDashboardStats();
    }
  }


  loadDashboardStats(): void {
    this.adminDashboardService.getDashboardStats().subscribe({
      next: (data) => {
        console.log('Fetched data:', data); // Debug: Log the response
        // Map backend data to stats array for cards
        this.stats = [
          { title: 'Job Posts', value: data.totalJobOffers || 0 },
          { title: 'Internship Posts', value: data.totalInternshipOffers || 0 },
          { title: 'Total Applications', value: data.totalApplications || 0 },
          { title: 'Total Candidates', value: data.totalCandidates || 0 },
          { title: 'Total Recruiters', value: data.totalRecruiters || 0 }
        ];

        // Update candidatesByGender for the chart
        this.candidatesByGender = data.candidatesByGender || { Females: 0, Males: 0 };

        // Update registeredByCountry for the chart
        this.registeredByCountry = data.registeredByCountry || {};

        // Initialize charts after data is loaded
        this.initializeCharts();
      },
      error: (error) => {
        console.error('Error fetching dashboard stats:', error);
        // Fallback data in case of error
        this.stats = [
          { title: 'Job Posts', value: 0 },
          { title: 'Internship Posts', value: 0 },
          { title: 'Total Applications', value: 0 },
          { title: 'Total Candidates', value: 0 },
          { title: 'Total Recruiters', value: 0 }
        ];
        this.candidatesByGender = { Females: 0, Males: 0 };
        this.registeredByCountry = {};
        this.initializeCharts(); // Still initialize charts with fallback data
      }
    });
  }
  private candidatesChart: Chart | null = null;
  private registeredChart: Chart | null = null;

  initializeCharts(): void {
    if (this.candidatesChart) this.candidatesChart.destroy();
    if (this.registeredChart) this.registeredChart.destroy();

    setTimeout(() => {
      const candidatesCanvas = document.getElementById('candidatesChart') as HTMLCanvasElement;
      if (candidatesCanvas) {
        this.candidatesChart = new Chart(candidatesCanvas, {
          type: 'bar',
          data: {
            labels: ['Females', 'Males'],
            datasets: [{
              label: 'Number of Candidates',
              data: [this.candidatesByGender.Females, this.candidatesByGender.Males],
              backgroundColor: ['#FF6384', '#36A2EB'],
              borderWidth: 1
            }]
          },
          options: {
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: true } }
          }
        });
      } else {
        console.error('candidatesChart canvas not found');
      }

      const registeredCanvas = document.getElementById('registeredChart') as HTMLCanvasElement;
      const countryLabels = Object.keys(this.registeredByCountry);
      const countryData = Object.values(this.registeredByCountry);
      if (registeredCanvas && countryLabels.length > 0) {
        this.registeredChart = new Chart(registeredCanvas, {
          type: 'bar',
          data: {
            labels: countryLabels,
            datasets: [{
              label: 'Number of Registered',
              data: countryData,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              borderWidth: 1
            }]
          },
          options: {
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: true } }
          }
        });
      } else {
        console.warn('No data or registeredChart canvas not found');
      }
    }, 100); // Increased delay for DOM readiness
  }
  /*Gestion de la navigation dans la barre latérale
  setView(view: string): void {
    this.currentView = view;
    if (view === 'dashboard') {
      setTimeout(() => this.initializeCharts(), 0);
    }
  }*/
  setView(view: string): void {
    this.currentView = view;
    if (view === 'dashboard') {
      this.loadDashboardStats(); // Ensure data is reloaded when switching to dashboard
    }
  }

  // Validation du formulaire des paramètres
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : {mismatch: true};
  }

  onSubmitSettings(): void {
    if (this.settingsForm.valid) {
      console.log('Settings updated:', this.settingsForm.value);
      this.successMessage = 'Settings updated successfully !';
      this.errorMessage = null;
      this.settingsForm.reset();
      setTimeout(() => {
        this.successMessage = null;
      }, 3000);
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
  // Afficher le profil
  viewCandidateProfile(candidate: any): void {
    this.selectedCandidate = candidate;
    this.currentCandidateIndex = this.candidates.indexOf(candidate);
  }
  viewRecruiterProfile(recruiter: any): void {
    this.selectedRecruiter = recruiter;
    this.currentRecruiterIndex = this.recruiters.indexOf(recruiter);
  }
  viewOffer(offer: any): void {
    this.selectedOffer= offer;
    this.currentOfferIndex = this.Offers.indexOf(offer);
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


  // Supprimer un candidat
  deleteCandidate(candidate: any): void {
    const index = this.candidates.indexOf(candidate);
    if (index !== -1) {
      this.candidates.splice(index, 1);
      if (this.selectedCandidate && this.selectedCandidate.name === candidate.name) {
        this.currentCandidateIndex = Math.min(this.currentCandidateIndex, this.candidates.length - 1);
        this.selectedCandidate = this.candidates.length > 0 ? this.candidates[this.currentCandidateIndex] : null;
      }
      if (this.candidates.length === 0) {
        this.backToListCandidate();
      }
    }
  }
  // Supprimer un recruteur
  deleteRecruiter(recruiter: any): void {
    const index = this.recruiters.indexOf(recruiter);
    if (index !== -1) {
      this.recruiters.splice(index, 1);
      if (this.selectedRecruiter && this.selectedRecruiter.name === recruiter.name) {
        this.currentRecruiterIndex = Math.min(this.currentRecruiterIndex, this.recruiters.length - 1);
        this.selectedRecruiter = this.recruiters.length > 0 ? this.recruiters[this.currentRecruiterIndex] : null;
      }
      if (this.recruiters.length === 0) {
        this.backToListRecruiter();
      }
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

}

