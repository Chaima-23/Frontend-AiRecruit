import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthRedirectService } from '../../../core/services/Auth-redirect.service';
import { CandidateDashboardService } from '../../../core/services/candidate-dashboard.service';
import { CvExtractionService } from '../../../core/services/cv-extraction.service';
import { OfferModel } from '../../../models/offers/offer.model';
import { FullTimeJobModel } from '../../../models/offers/full-time-job.model';
import { InternshipOfferModel } from '../../../models/offers/internship-offer.model';
import { PartTimeJobModel } from '../../../models/offers/part-time-job.model';
import { TestModel} from '../../../models/test/test.model';
import {QuestionType} from '../../../models/test/question-type.enum';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './candidate-dashboard.component.html',
  styleUrls: ['./candidate-dashboard.component.css']
})
export class CandidateDashboardComponent implements OnInit {
  // State Management
  currentView: string = 'personal';
  logoutMessage: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isOtherCountry: boolean = false;
  searchQuery: string = '';
  currentQuestionIndex: number = 0;

  // Form Groups
  personalForm: FormGroup;
  profileForm: FormGroup;

  // Offer and Application Data
  selectedOffer: OfferModel | null = null;
  offerForUpload: OfferModel | null = null;
  selectedFullTimeJob: FullTimeJobModel | null = null;
  selectedPartTimeJob: PartTimeJobModel | null = null;
  selectedInternshipOffer: InternshipOfferModel | null = null;
  myApplications: any[] = [];
  offers: OfferModel[] = [];
  displayedOffers: OfferModel[] = [];

  // CV Upload
  selectedFile: File | null = null;
  loading: boolean = false;
  error: string | null = null;

  // Test Data
  test: TestModel | null = null;
  answers: (number | number[] | null)[] = []; // Adjusted to handle both single and multiple selections

  // Pagination
  currentPage: number = 1;
  offersPerPage: number = 6;
  totalPages: number = 0;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authRedirectService: AuthRedirectService,
    private dashboardService: CandidateDashboardService,
    private cvService: CvExtractionService
  ) {
    const userInfo = this.authRedirectService.getUserInfo();

    // Initialize Personal Form
    this.personalForm = this.fb.group({
      firstName: [userInfo?.firstName || '', Validators.required],
      lastName: [userInfo?.lastName || '', Validators.required],
      email: [userInfo?.email || '', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      otherCountry: [''],
      city: [''],
      address: [''],
      phoneNumber: ['']
    });

    // Initialize Profile Form
    this.profileForm = this.fb.group({
      diploma: [''],
      specialization: [''],
      yearsOfExperience: [''],
      technicalSkills: [''],
      softSkills: ['']
    });
  }

  ngOnInit(): void {
    this.loadOffers();
    this.calculatePagination();
    this.updateDisplayedOffers();
  }

  // View Management
  setView(view: string): void {
    this.currentView = view;
    if (view === 'offers') {
      this.loadOffers();
    } else if (view === 'test') {
      this.loadTest();
    }
  }

  setViewUploadCv(offer: OfferModel): void {
    console.log('Setting view to upload-cv for offer:', offer.id);
    this.offerForUpload = offer;
    this.currentView = 'upload-cv';
    this.selectedFile = null;
    this.loading = false;
    this.error = null;
    this.successMessage = null;
  }

  applyFromModal(offer: OfferModel | null): void {
    if (offer) {
      this.setViewUploadCv(offer);
      this.closeModal();
    }
  }

  // Form Submissions
  onSubmitPersonal(): void {
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

  onSubmitProfile(): void {
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

  // Offer Management
  setSelectedOffer(offer: OfferModel): void {
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

  loadOffers(): void {
    this.dashboardService.getAllOffers().subscribe({
      next: (response: { message: string; data: OfferModel[] }) => {
        this.offers = response.data;
        this.calculatePagination();
        this.updateDisplayedOffers();
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load offers.';
        setTimeout(() => (this.errorMessage = null), 3000);
      }
    });
  }

  showOfferDetails(offer: OfferModel): void {
    this.dashboardService.getOfferById(offer.id).subscribe({
      next: (response: { message: string; data: OfferModel }) => {
        this.setSelectedOffer(response.data);
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load offer details.';
        setTimeout(() => (this.errorMessage = null), 3000);
      }
    });
  }

  // CV Upload Logic
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
        this.error = null;
        this.successMessage = null;
      } else {
        this.error = 'Please upload a PDF file only.';
        this.selectedFile = null;
        this.successMessage = null;
      }
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      this.error = 'No file selected.';
      return;
    }

    if (!this.offerForUpload) {
      this.error = 'No offer selected.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.successMessage = null;

    this.cvService.extractTextFromPdf(this.selectedFile).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = 'CV uploaded successfully!';
        console.log('Texte extrait :', res.text);
        console.log('Texte json :', res.spring_response);
        this.loadTest();
        setTimeout(() => {
          this.successMessage = null;
          this.currentView = 'test';
          this.offerForUpload = null;
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'An error occurred while extracting text.';
      }
    });
  }

// Test Management
  loadTest(): void {
    this.test = null;
    this.answers = [];
    this.currentQuestionIndex = 0;
    this.loading = true;
    this.dashboardService.getLatestTest().subscribe({
      next: (response: { message: string; data: TestModel }) => {
        this.test = response.data;
        this.answers = new Array(this.test.questions.length).fill(null).map(() => []);
        this.loading = false;
        console.log('Test loaded:', this.test);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = 'Failed to load test.';
        setTimeout(() => (this.errorMessage = null), 3000);
      }
    });
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < (this.test?.questions.length || 0) - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  onAnswerChange(event: Event, optionIndex: number): void {
    const input = event.target as HTMLInputElement;
    let currentAnswers = this.answers[this.currentQuestionIndex] as number[] | null;
    if (!Array.isArray(currentAnswers)) {
      currentAnswers = [];
      this.answers[this.currentQuestionIndex] = currentAnswers;
    }
    if (input.checked) {
      currentAnswers.push(optionIndex);
    } else {
      const index = currentAnswers.indexOf(optionIndex);
      if (index !== -1) {
        currentAnswers.splice(index, 1);
      }
      if (currentAnswers.length === 0) {
        this.answers[this.currentQuestionIndex] = null;
      }
    }
  }

  isOptionSelected(questionIndex: number, optionIndex: number): boolean {
    const answers = this.answers[questionIndex];
    return Array.isArray(answers) && answers.includes(optionIndex);
  }

  isTestValid(): boolean {
    return this.answers.every(answer => answer !== null && (Array.isArray(answer) ? answer.length > 0 : true));
  }

  submitTest(): void {
    if (this.isTestValid()) {
      console.log('Test submitted with answers:', this.answers);
      this.successMessage = 'Test submitted successfully!';
      setTimeout(() => {
        this.successMessage = null;
        this.currentView = 'offers';
        this.test = null;
        this.answers = [];
        this.currentQuestionIndex = 0;
      }, 60000);
    } else {
      this.errorMessage = 'Please answer all questions.';
      setTimeout(() => (this.errorMessage = null), 3000);
    }
  }
  // Pagination Management
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.offers.length / this.offersPerPage);
  }

  updateDisplayedOffers(): void {
    const startIndex = (this.currentPage - 1) * this.offersPerPage;
    const endIndex = startIndex + this.offersPerPage;
    this.displayedOffers = this.offers.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedOffers();
    }
  }

  closeModal(): void {
    this.selectedOffer = null;
    this.selectedFullTimeJob = null;
    this.selectedPartTimeJob = null;
    this.selectedInternshipOffer = null;
  }

  filterOffers(): void {
    const query = this.searchQuery.toLowerCase().trim();

    if (query === '') {
      this.updateDisplayedOffers();
      return;
    }

    const filtered = this.offers.filter(offer =>
      offer.field?.toLowerCase().includes(query) ||
      offer.country?.toLowerCase().includes(query) ||
      offer.city?.toLowerCase().includes(query) ||
      offer.description?.toLowerCase().includes(query) ||
      offer.offerType?.toLowerCase().includes(query)
    );

    this.totalPages = Math.ceil(filtered.length / this.offersPerPage);
    const startIndex = (this.currentPage - 1) * this.offersPerPage;
    const endIndex = startIndex + this.offersPerPage;
    this.displayedOffers = filtered.slice(startIndex, endIndex);
  }

  // Static table data
  myApplicationsTableData: { title: string, type: string, score: string }[] = [
    { title: 'Software Engineer', type: 'full-time', score: '85%' },
    { title: 'Marketing Intern', type: 'internship', score: '72%' },
    { title: 'Designer', type: 'part-time', score: '90%' },
    { title: 'IT Support Intern', type: 'Internship', score: '90%' }
  ];

}
