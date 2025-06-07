import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthRedirectService } from '../../../core/services/Auth-redirect.service';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './candidate-dashboard.component.html',
  styleUrls: ['./candidate-dashboard.component.css']
})
export class CandidateDashboardComponent {
  currentView: string = 'personal';
  logoutMessage: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isOtherCountry: boolean = false;

  // Formulaire pour la section "Personal"
  personalForm: FormGroup;

  // Formulaire pour la section "Profile"
  profileForm: FormGroup;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authRedirectService: AuthRedirectService
  ) {
    // Initialisation du formulaire "Personal"
    this.personalForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      otherCountry: [''],
      city: [''],
      address: [''],
      phoneNumber: ['']
    });

    // Initialisation du formulaire "Profile"
    this.profileForm = this.fb.group({
      diploma: [''],
      specialization: [''],
      yearsOfExperience: [''],
      technicalSkills: [''],
      softSkills: ['']
    });
  }


  setView(view: string): void {
    this.currentView = view;
  }

  onSubmitPersonal() {
    if (this.personalForm.valid) {
      this.successMessage = 'Personal information saved successfully!';
      this.errorMessage = null;
      setTimeout(() => {
        this.successMessage = null;
      }, 3000);
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
      this.successMessage = null;
    }
  }
  onCountryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.isOtherCountry = target.value === 'Other';
    if (!this.isOtherCountry) {
      this.personalForm.get('otherCountry')?.setValue('');
    }
  }

  onSubmitProfile() {
    if (this.profileForm.valid) {
      this.successMessage = 'Profile updated successfully!';
      this.errorMessage = null;
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
  selectedOffer: any = null;
  myApplications: any[] = [];
  offers: any[] = [
    {
      company: 'Insight Analytics',
      location: 'Sfax, Tunisia',
      title: 'Data Science Intern',
      field: 'Data Science',
      country: 'Tunisia',
      city: 'Sfax',
      description: 'Unlock hands-on experience with AI-driven analytics! Gain hands-on experience of data with AI-driven analytics, predictive modeling, and real-world datasets—perfect for computer vision, deep learning, and automation!',
      minimumQualifications: 'Bachelor’s degree in Computer Science or related field. Familiarity with AI concepts.',
      dutiesResponsibilities: 'Analyze datasets, build predictive models, assist in AI-driven projects.',
      tools: ['Python', 'TensorFlow', 'Pandas', 'Jupyter Notebook', 'SQL'],
      salary: '500',
      deadline: '2025-06-30',
      workMode: 'On-site',
      status: 'Open',
      type: 'Internship',
      startDate: '2025-07-01', // Internship-specific
      endDate: '2025-12-31' // Internship-specific
    },
    {
      company: 'CodeVertex Innovations',
      location: 'Tunis, Tunisia',
      title: 'Software Engineer',
      field: 'Software Development',
      country: 'Tunisia',
      city: 'Tunis',
      description: 'CodeVertex Innovations seeks a Software Engineer to build scalable apps, joining us to work on cutting-edge tech in backend and frontend development!',
      minimumQualifications: 'Bachelor’s degree in Software Engineering. 2+ years of experience in backend development.',
      dutiesResponsibilities: 'Develop and maintain scalable applications, collaborate with frontend teams.',
      tools: ['Java', 'Spring Boot', 'Node.js', 'Docker', 'PostgreSQL'],
      salary: '2500',
      deadline: '2025-07-15',
      workMode: 'Hybrid',
      status: 'Open',
      type: 'Full Time',
      workingHours: '9 AM - 5 PM', // Full Time-specific
      benefits: 'Health insurance, annual bonuses', // Full Time-specific
      position: 'Senior Software Engineer', // Full Time-specific
      contractType: 'Permanent' // Full Time-specific
    },
    {
      company: 'Visionary Dynamics',
      location: 'Sousse, Tunisia',
      title: 'Product Manager',
      field: 'Product Management',
      country: 'Tunisia',
      city: 'Sousse',
      description: 'Drive innovation by leading product development and collaborate with teams to build groundbreaking solutions—ideal for analytical leaders!',
      minimumQualifications: 'Bachelor’s degree in Business or related field. 3+ years of product management experience.',
      dutiesResponsibilities: 'Lead product development, define roadmaps, collaborate with stakeholders.',
      tools: ['Jira', 'Figma', 'SQL', 'Google Analytics'],
      salary: '2100',
      deadline: '2025-06-20',
      workMode: 'On-site',
      status: 'Open',
      type: 'Full Time',
      workingHours: '9 AM - 6 PM', // Full Time-specific
      benefits: 'Health insurance, paid leave', // Full Time-specific
      position: 'Lead Product Manager', // Full Time-specific
      contractType: 'Permanent' // Full Time-specific
    },
    {
      company: 'SynapseX Labs',
      location: 'Tunis, Tunisia',
      title: 'AI & Machine Learning Engineer',
      field: 'Artificial Intelligence',
      country: 'Tunisia',
      city: 'Tunis',
      description: 'Develop AI-driven solutions in deep learning, NLP, and computer vision, join us to shape the future of predictive analytics and automation!',
      minimumQualifications: 'Master’s degree in AI or related field. 3+ years of experience in machine learning.',
      dutiesResponsibilities: 'Build AI models, optimize algorithms, deploy solutions in production.',
      tools: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'AWS SageMaker'],
      salary: '3500',
      deadline: '2025-08-01',
      workMode: 'Remote',
      status: 'Open',
      type: 'Full Time',
      workingHours: 'Flexible', // Full Time-specific
      benefits: 'Health insurance, remote work allowance', // Full Time-specific
      position: 'AI Engineer', // Full Time-specific
      contractType: 'Permanent' // Full Time-specific
    },
    {
      company: 'BrightSphere Solutions',
      location: 'Hammamet, Tunisia',
      title: 'Marketing & Social Media Intern',
      field: 'Marketing',
      country: 'Tunisia',
      city: 'Hammamet',
      description: 'Manage social media, create content, and analyze trends to enhance brand visibility for aspiring digital marketers!',
      minimumQualifications: 'Currently pursuing a degree in Marketing or related field. Strong communication skills.',
      dutiesResponsibilities: 'Create social media content, analyze engagement metrics, assist in campaigns.',
      tools: ['Canva', 'Google Analytics', 'Meta Ads', 'SEO Tools'],
      salary: '450',
      deadline: '2025-06-15',
      workMode: 'Remote',
      status: 'Open',
      type: 'Part Time',
      workingHours: '20 hours/week', // Part Time-specific
      schedule: 'Flexible, mostly evenings', // Part Time-specific
      position: 'Social Media Intern' // Part Time-specific
    },
    {
      company: 'LedgerWise Consulting',
      location: 'Tunis, Tunisia',
      title: 'Financial Analyst',
      field: 'Finance',
      country: 'Tunisia',
      city: 'Tunis',
      description: 'LedgerWise Consulting is seeking a Financial Analyst to assess financial data, create reports, and provide strategic insights, ideal for detail-oriented professionals with strong analytical and accounting skills.',
      minimumQualifications: 'Bachelor’s degree in Finance or Accounting. 2+ years of experience in financial analysis.',
      dutiesResponsibilities: 'Analyze financial data, prepare reports, provide strategic recommendations.',
      tools: ['Excel', 'SAP', 'Google Sheets', 'Microsoft PowerPoint'],
      salary: '2450',
      deadline: '2025-07-10',
      workMode: 'On-site',
      status: 'Open',
      type: 'Full Time',
      workingHours: '9 AM - 5 PM', // Full Time-specific
      benefits: 'Health insurance, retirement plan', // Full Time-specific
      position: 'Financial Analyst', // Full Time-specific
      contractType: 'Permanent' // Full Time-specific
    },
    {
      company: 'TechTrend Innovations',
      location: 'Sfax, Tunisia',
      title: 'Frontend Developer',
      field: 'Web Development',
      country: 'Tunisia',
      city: 'Sfax',
      description: 'Join TechTrend Innovations to create stunning user interfaces using modern JavaScript frameworks!',
      minimumQualifications: 'Bachelor’s degree in Computer Science. 1+ years of experience in frontend development.',
      dutiesResponsibilities: 'Develop user interfaces, collaborate with backend developers, ensure responsive design.',
      tools: ['React', 'Vue.js', 'CSS', 'HTML'],
      salary: '1800',
      deadline: '2025-07-20',
      workMode: 'Hybrid',
      status: 'Open',
      type: 'Full Time',
      workingHours: '9 AM - 5 PM', // Full Time-specific
      benefits: 'Health insurance, annual bonuses', // Full Time-specific
      position: 'Frontend Developer', // Full Time-specific
      contractType: 'Permanent' // Full Time-specific
    },
    {
      company: 'DataPulse Analytics',
      location: 'Tunis, Tunisia',
      title: 'Business Intelligence Analyst',
      field: 'Business Intelligence',
      country: 'Tunisia',
      city: 'Tunis',
      description: 'Analyze data to provide actionable insights for business growth at DataPulse Analytics!',
      minimumQualifications: 'Bachelor’s degree in Business or related field. 2+ years of experience in BI tools.',
      dutiesResponsibilities: 'Create dashboards, analyze data trends, provide insights for decision-making.',
      tools: ['Power BI', 'Tableau', 'SQL', 'Excel'],
      salary: '2200',
      deadline: '2025-07-25',
      workMode: 'On-site',
      status: 'Open',
      type: 'Full Time',
      workingHours: '9 AM - 6 PM', // Full Time-specific
      benefits: 'Health insurance, paid leave', // Full Time-specific
      position: 'BI Analyst', // Full Time-specific
      contractType: 'Permanent' // Full Time-specific
    }
  ];

  // Pagination properties
  currentPage: number = 1;
  offersPerPage: number = 6;
  totalPages: number = 0;
  displayedOffers: any[] = [];

  ngOnInit() {
    this.calculatePagination();
    this.updateDisplayedOffers();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.offers.length / this.offersPerPage);
  }

  updateDisplayedOffers() {
    const startIndex = (this.currentPage - 1) * this.offersPerPage;
    const endIndex = startIndex + this.offersPerPage;
    this.displayedOffers = this.offers.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedOffers();
    }
  }


  showOfferDetails(offer: any) {
    this.selectedOffer = offer;
  }

  closeModal() {
    this.selectedOffer = null;
  }

}
