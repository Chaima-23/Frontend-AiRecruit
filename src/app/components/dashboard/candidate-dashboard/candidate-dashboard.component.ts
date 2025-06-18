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

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  // Form Groups
  personalForm: FormGroup;
  profileForm: FormGroup;

  // Offer and Application Data
  selectedOffer: OfferModel | null = null; // For modal display
  offerForUpload: OfferModel | null = null; // For CV upload
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
    }
  }

  setViewUploadCv(offer: OfferModel): void {
    console.log('Setting view to upload-cv for offer:', offer.id);
    this.offerForUpload = offer; // Store offer for CV upload
    this.currentView = 'upload-cv';
    // Reset CV upload state
    this.selectedFile = null;
    this.loading = false;
    this.error = null;
    this.successMessage = null;
  }

  // Handle Apply Now from modal
  applyFromModal(offer: OfferModel | null): void {
    if (offer) {
      this.setViewUploadCv(offer); // Switch to upload-cv view
      this.closeModal(); // Close the modal
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

    if (!this.offerForUpload) { // Use offerForUpload instead of selectedOffer
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
        // Submit application with offerForUpload.id
        setTimeout(() => {
          this.successMessage = null;
          this.currentView = 'offers';
          this.offerForUpload = null; // Reset after submission
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'An error occurred while extracting text.';
      }
    });
  }

  // Submit Application
  private submitApplication(offerId: number, cvData: { text: string; spring_response: string }): void {
    const candidateId = this.authRedirectService.getUserInfo()?.id;
    if (!candidateId) {
      this.error = 'User not authenticated.';
      return;
    }

    const applicationData = {
      offerId: Number(offerId),
      candidateId,
      cvText: cvData.text,
      cvJson: cvData.spring_response
    };


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
}
