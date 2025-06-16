import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import Chart from 'chart.js/auto';
import { AuthRedirectService } from '../../../core/services/Auth-redirect.service';
import { FullTimeJobModel } from '../../../models/offers/full-time-job.model';
import { PartTimeJobModel } from '../../../models/offers/part-time-job.model';
import { InternshipOfferModel } from '../../../models/offers/internship-offer.model';
import { RecruiterDashboardService } from '../../../core/services/recruiter-dashboard.service';
import { OfferModel } from '../../../models/offers/offer.model';
import { ApplicationRequest } from '../../../models/request/application-request.model';
import {CandidateModel} from '../../../models/idm/candidate.model';

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxChartsModule
  ],
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.css']
})
export class RecruiterDashboardComponent implements AfterViewInit {
  currentView: string = 'dashboard';
  offersTab: string = 'post';
  showOtherCountry: boolean = false;
  offerType: string = '';
  logoutMessage: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  selectedOffer: any = null;
  isEditing: boolean = false;
  settingsForm: FormGroup;
  offerForm: FormGroup;
  offers: any[] = [];

  dailyViewsData = [
    { name: 'M', value: 10 },
    { name: 'Tu', value: 5 },
    { name: 'W', value: 15 },
    { name: 'Th', value: 20 },
    { name: 'F', value: 12 },
    { name: 'Sa', value: 15 },
    { name: 'Su', value: 14 }
  ];

  colorScheme: any = {
    domain: ['#00CED1', '#1E90FF', '#20B2AA', '#4682B4', '#5F9EA0', '#6495ED', '#87CEEB']
  };

  topScorers = [
    { name: 'Jane Cooper', title: 'Cloud Engineer', percentage: '99.99%', rank: '1st', date: '2025-05-01' },
    { name: 'Eleanor Pena', title: 'Cybersecurity Specialist', percentage: '99.76%', rank: '2nd', date: '2025-05-01' },
    { name: 'Devon Lane', title: 'Web Developer', percentage: '99.50%', rank: '3rd', date: '2025-05-01' }
  ];

  originalTopScorers = [...this.topScorers];

  candidatesChartData = {
    labels: ['Females', 'Males'],
    datasets: [{
      label: 'Candidates Distribution',
      data: [8, 4],
      backgroundColor: ['#1a73e8', '#b3e5fc'],
      borderWidth: 0,
      hoverBackgroundColor: ['#1a73e8', '#b3e5fc']
    }]
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authRedirectService: AuthRedirectService,
    private recruiterDashboardService: RecruiterDashboardService
  ) {
    this.settingsForm = this.fb.group({
      recruiterName: [''],
      recruiterEmail: ['', [Validators.email]],
      companyName: [''],
      companySize: [''],
      country: [''],
      city: [''],
      addressLine1: [''],
      addressLine2: [''],
      phoneNumber1: [''],
      phoneNumber2: [''],
      companyWebsite: [''],
      field: ['']
    });

    this.offerForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      field: ['', [Validators.required]],
      country: ['', [Validators.required]],
      otherCountry: [''],
      city: ['', [Validators.required]],
      minQualifications: [''],
      duties: [''],
      tools: ['', [Validators.required]],
      salary: ['', [Validators.required]],
      deadline: ['', [Validators.required]],
      workMode: [''],
      status: ['ACTIVE'],
      offerType: [''],
      position: [''],
      workingHours: [''],
      benefits: [''],
      contractType: [''],
      schedule: [''],
      startDate: [''],
      endDate: ['']
    }, {
      validators: this.dateValidator
    });
  }

  dateValidator(form: FormGroup) {
    const startDate = form.get('startDate')?.value;
    const endDate = form.get('endDate')?.value;
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      return { invalidDateRange: true };
    }
    return null;
  }

  ngAfterViewInit(): void {
    if (this.currentView === 'dashboard') {
      this.initializeCandidatesChart();
    }
  }

  initializeCandidatesChart(): void {
    const candidatesCtx = (document.getElementById('candidatesPieChart') as HTMLCanvasElement)?.getContext('2d');
    if (candidatesCtx) {
      new Chart(candidatesCtx, {
        type: 'pie',
        data: this.candidatesChartData,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: true,
              callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}` },
              titleFont: { size: 10 },
              bodyFont: { size: 10 },
              padding: 4,
              caretSize: 4
            }
          }
        }
      });
    }
  }

  setView(view: string): void {
    this.currentView = view;
    if (view === 'dashboard') {
      setTimeout(() => this.initializeCandidatesChart(), 0);
    }
  }

  setOffersTab(tab: string): void {
    this.offersTab = tab;
    this.selectedOffer = null;
    this.isEditing = false;
    this.offerForm.reset();
    if (tab === 'my-offers') {
      console.log('Attempting to load my offers from backend...');
      this.recruiterDashboardService.getMyOffers().subscribe({
        next: (response) => {
          console.log('My offers loaded successfully:', response.data);
          this.offers = response.data;
        },
        error: (error) => {
          console.error('Error loading my offers from backend:', error);
          this.errorMessage = 'Erreur lors du chargement des offres : ' + (error.error?.message || error.message);
        }
      });
    }
  }

  onCountryChange(event: Event) {
    const selectedCountry = (event.target as HTMLInputElement).value;
    this.showOtherCountry = selectedCountry === 'other';
    if (!this.showOtherCountry) {
      this.offerForm.get('otherCountry')?.setValue('');
    }
  }

  onOfferTypeChange(event: Event) {
    this.offerType = (event.target as HTMLInputElement).value;
    this.offerForm.get('position')?.setValue('');
    this.offerForm.get('workingHours')?.setValue('');
    this.offerForm.get('benefits')?.setValue('');
    this.offerForm.get('contractType')?.setValue('');
    this.offerForm.get('schedule')?.setValue('');
    this.offerForm.get('startDate')?.setValue('');
    this.offerForm.get('endDate')?.setValue('');
  }

  onSubmitOffer() {
    if (this.offerForm.valid) {
      const formValue = this.offerForm.value;
      const baseOffer: OfferModel = {
        id: this.isEditing ? this.selectedOffer.id : null,
        deadline: formValue.deadline,
        description: formValue.description,
        dutiesAndResponsibilities: formValue.duties,
        field: formValue.field,
        country: formValue.country === 'other' ? formValue.otherCountry : formValue.country,
        city: formValue.city,
        minQualifications: formValue.minQualifications,
        salary: parseFloat(formValue.salary),
        tools: formValue.tools,
        workMode: formValue.workMode.toUpperCase(),
        status: formValue.status.toUpperCase(),
        offerType: formValue.offerType.toUpperCase()
      };

      if (this.isEditing) {
        console.log('Attempting to update offer with ID:', baseOffer.id);
        switch (formValue.offerType) {
          case 'Full-time':
            const fullTimeJob: FullTimeJobModel = {
              ...baseOffer,
              position: formValue.position || '',
              workingHours: parseInt(formValue.workingHours || '0', 10),
              benefits: formValue.benefits || '',
              contractType: formValue.contractType || ''
            };
            this.recruiterDashboardService.updateFullTimeJob(baseOffer.id!, fullTimeJob).subscribe({
              next: (response) => {
                console.log('Offer updated successfully:', response.data);
                this.offers = this.offers.map(o => o.id === baseOffer.id ? response.data : o);
                this.successMessage = response.message || 'Offer updated successfully.';
                this.errorMessage = null;
                this.isEditing = false;
                this.selectedOffer = null;
                this.offerForm.reset();
                this.showOtherCountry = false;
                this.offerType = '';
                setTimeout(() => this.successMessage = null, 3000);
              },
              error: (error) => {
                console.error('Error updating offer:', error);
                this.errorMessage = 'Error updating offer: ' + (error.error?.message || error.message);
                this.successMessage = null;
              }
            });
            break;
          case 'Part-time':
            const partTimeJob: PartTimeJobModel = {
              ...baseOffer,
              position: formValue.position || '',
              workingHours: parseInt(formValue.workingHours || '0', 10),
              schedule: formValue.schedule || ''
            };
            this.recruiterDashboardService.updatePartTimeJob(baseOffer.id!, partTimeJob).subscribe({
              next: (response) => {
                console.log('Offer updated successfully:', response.data);
                this.offers = this.offers.map(o => o.id === baseOffer.id ? response.data : o);
                this.successMessage = response.message || 'Offer updated successfully.';
                this.errorMessage = null;
                this.isEditing = false;
                this.selectedOffer = null;
                this.offerForm.reset();
                this.showOtherCountry = false;
                this.offerType = '';
                setTimeout(() => this.successMessage = null, 3000);
              },
              error: (error) => {
                console.error('Error updating offer:', error);
                this.errorMessage = 'Error updating offer: ' + (error.error?.message || error.message);
                this.successMessage = null;
              }
            });
            break;
          case 'Internship':
            const internshipOffer: InternshipOfferModel = {
              ...baseOffer,
              startDate: formValue.startDate,
              endDate: formValue.endDate
            };
            this.recruiterDashboardService.updateInternshipOffer(baseOffer.id!, internshipOffer).subscribe({
              next: (response) => {
                console.log('Offer updated successfully:', response.data);
                this.offers = this.offers.map(o => o.id === baseOffer.id ? response.data : o);
                this.successMessage = response.message || 'Offer updated successfully.';
                this.errorMessage = null;
                this.isEditing = false;
                this.selectedOffer = null;
                this.offerForm.reset();
                this.showOtherCountry = false;
                this.offerType = '';
                setTimeout(() => this.successMessage = null, 3000);
              },
              error: (error) => {
                console.error('Error updating offer:', error);
                this.errorMessage = 'Error updating offer: ' + (error.error?.message || error.message);
                this.successMessage = null;
              }
            });
            break;
        }
      } else {
        console.log('Attempting to create new offer:', baseOffer);
        switch (formValue.offerType) {
          case 'Full-time':
            const fullTimeJob: FullTimeJobModel = { ...baseOffer, position: formValue.position || '', workingHours: parseInt(formValue.workingHours || '0', 10), benefits: formValue.benefits || '', contractType: formValue.contractType || '' };
            this.recruiterDashboardService.createFullTimeJob(fullTimeJob).subscribe({
              next: (response) => {
                console.log('Offer created successfully:', response.data);
                this.offers.push(response.data);
                this.successMessage = response.message;
                this.errorMessage = null;
                this.offerForm.reset();
                this.showOtherCountry = false;
                this.offerType = '';
                setTimeout(() => this.successMessage = null, 3000);
              },
              error: (error) => {
                console.error('Error creating offer:', error);
                this.errorMessage = 'Erreur lors de la création de l\'offre : ' + (error.error?.message || error.message);
                this.successMessage = null;
              }
            });
            break;
          case 'Part-time':
            const partTimeJob: PartTimeJobModel = { ...baseOffer, position: formValue.position || '', workingHours: parseInt(formValue.workingHours || '0', 10), schedule: formValue.schedule || '' };
            this.recruiterDashboardService.createPartTimeJob(partTimeJob).subscribe({
              next: (response) => {
                console.log('Offer created successfully:', response.data);
                this.offers.push(response.data);
                this.successMessage = response.message;
                this.errorMessage = null;
                this.offerForm.reset();
                this.showOtherCountry = false;
                this.offerType = '';
                setTimeout(() => this.successMessage = null, 3000);
              },
              error: (error) => {
                console.error('Error creating offer:', error);
                this.errorMessage = 'Erreur lors de la création de l\'offre : ' + (error.error?.message || error.message);
                this.successMessage = null;
              }
            });
            break;
          case 'Internship':
            const internshipOffer: InternshipOfferModel = { ...baseOffer, startDate: formValue.startDate, endDate: formValue.endDate };
            this.recruiterDashboardService.createInternshipOffer(internshipOffer).subscribe({
              next: (response) => {
                console.log('Offer created successfully:', response.data);
                this.offers.push(response.data);
                this.successMessage = response.message;
                this.errorMessage = null;
                this.offerForm.reset();
                this.showOtherCountry = false;
                this.offerType = '';
                setTimeout(() => this.successMessage = null, 3000);
              },
              error: (error) => {
                console.error('Error creating offer:', error);
                this.errorMessage = 'Erreur lors de la création de l\'offre : ' + (error.error?.message || error.message);
                this.successMessage = null;
              }
            });
            break;
        }
      }
    } else {
      this.errorMessage = 'Veuillez remplir correctement le formulaire.';
      this.successMessage = null;
    }
  }

  updateOffer(offer: any) {
    this.selectedOffer = offer;
    this.isEditing = true;
    this.offersTab = 'post';
    this.offerType = offer.offerType;
    this.showOtherCountry = offer.country === 'other';
    this.offerForm.patchValue({
      description: offer.description,
      field: offer.field || '',
      country: offer.country,
      otherCountry: offer.otherCountry || '',
      city: offer.city || '',
      minQualifications: offer.minQualifications || '',
      duties: offer.duties || '',
      tools: offer.tools || '',
      salary: offer.salary || '',
      deadline: offer.deadline || '',
      workMode: offer.workMode || '',
      status: offer.status || 'ACTIVE',
      offerType: offer.offerType || '',
      position: offer.position || '',
      workingHours: offer.workingHours || '',
      benefits: offer.benefits || '',
      contractType: offer.contractType || '',
      schedule: offer.schedule || '',
      startDate: offer.startDate || '',
      endDate: offer.endDate || ''
    });
  }

  cancelUpdate() {
    this.isEditing = false;
    this.selectedOffer = null;
    this.offerForm.reset();
    this.offersTab = 'my-offers';
  }

  deleteOffer(offer: any) {
    if (confirm('Are you sure you want to delete this offer?')) {
      const offerId = offer.id;
      console.log('Attempting to delete offer with ID:', offerId);
      switch (offer.offerType.toUpperCase()) {
        case 'FULL-TIME':
          this.recruiterDashboardService.deleteFullTimeJob(offerId).subscribe({
            next: () => {
              console.log('Offer deleted successfully, ID:', offerId);
              this.offers = this.offers.filter(o => o.id !== offerId);
              this.successMessage = 'Offer deleted successfully.';
              setTimeout(() => this.successMessage = null, 3000);
            },
            error: (error) => {
              console.error('Error deleting offer with ID:', offerId, error);
              this.errorMessage = 'Error deleting offer: ' + (error.error?.message || error.message);
            }
          });
          break;
        case 'PART-TIME':
          this.recruiterDashboardService.deletePartTimeJob(offerId).subscribe({
            next: () => {
              console.log('Offer deleted successfully, ID:', offerId);
              this.offers = this.offers.filter(o => o.id !== offerId);
              this.successMessage = 'Offer deleted successfully.';
              setTimeout(() => this.successMessage = null, 3000);
            },
            error: (error) => {
              console.error('Error deleting offer with ID:', offerId, error);
              this.errorMessage = 'Error deleting offer: ' + (error.error?.message || error.message);
            }
          });
          break;
        case 'INTERNSHIP':
          this.recruiterDashboardService.deleteInternshipOffer(offerId).subscribe({
            next: () => {
              console.log('Offer deleted successfully, ID:', offerId);
              this.offers = this.offers.filter(o => o.id !== offerId);
              this.successMessage = 'Offer deleted successfully.';
              setTimeout(() => this.successMessage = null, 3000);
            },
            error: (error) => {
              console.error('Error deleting offer with ID:', offerId, error);
              this.errorMessage = 'Error deleting offer: ' + (error.error?.message || error.message);
            }
          });
          break;
      }
    }
  }

  applications: any[] = [];
  favoriteCandidates: any[] = [];
  selectedProfile: CandidateModel | null = null;
  selectedApplicationOffer: OfferModel | null = null;

  ngOnInit(): void {
    console.log('Component initialized, loading applications and favorites...');
    this.loadApplications();
    this.loadFavoriteApplications();
  }

  loadApplications(offerId?: string): void {
    console.log('Attempting to load applications from backend for offer ID:', offerId);
    this.recruiterDashboardService.getApplications(offerId).subscribe({
      next: (response) => {
        console.log('Applications loaded successfully:', response.data);
        this.applications = response.data.map((app: any) => ({
          ...app,
          appliedDate: app.date ? new Date(app.date) : new Date(),
          isFavorite: false
        }));
      },
      error: (error) => {
        console.error('Error loading applications from backend:', error);
      }
    });
  }

  loadFavoriteApplications(): void {
    console.log('Attempting to load favorite applications from backend...');
    this.recruiterDashboardService.getFavoriteApplications().subscribe({
      next: (response) => {
        console.log('Favorite applications loaded successfully:', response.data);
        const favoriteApps: ApplicationRequest[] = response.data;
        this.favoriteCandidates = favoriteApps.map((app: ApplicationRequest) => ({
          firstName: app.candidate.firstName,
          yearsOfExperience: app.candidate.yearsOfExperience,
          description: app.offer.description,
          diploma: app.candidate.diploma,
          date: app.date ? new Date(app.date) : new Date(),
          isFavorite: true,
          id: app.id,
          offer: app.offer
        }));
        console.log('favoriteCandidates after mapping:', this.favoriteCandidates); // Ajout du log
        this.applications.forEach(app => {
          app.isFavorite = favoriteApps.some((fav: ApplicationRequest) => fav.id === app.id);
        });
      },
      error: (error) => {
        console.error('Error loading favorite applications from backend:', error);
      }
    });
  }
  viewApplications(offer: any): void {
    console.log('Viewing applications for offer ID:', offer.id);
    this.selectedApplicationOffer = offer;
    this.currentView = 'applications';
    this.loadApplications(offer.id);
  }

  toggleFavorite(application: any): void {
    console.log('Toggling favorite status for application ID:', application.id);
    const isFavorite = !application.isFavorite;
    if (isFavorite) {
      this.recruiterDashboardService.addApplicationToFavorites(application.id).subscribe({
        next: () => {
          console.log('Application added to favorites successfully, ID:', application.id);
          application.isFavorite = true;
          if (!this.favoriteCandidates.some(fc => fc.id === application.id)) {
            this.favoriteCandidates.push({ ...application, isFavorite: true });
          }
        },
        error: (error) => {
          console.error('Error adding application to favorites, ID:', application.id, error);
        }
      });
    } else {
      this.recruiterDashboardService.removeApplicationFromFavorites(application.id).subscribe({
        next: () => {
          console.log('Application removed from favorites successfully, ID:', application.id);
          application.isFavorite = false;
          this.favoriteCandidates = this.favoriteCandidates.filter(fc => fc.id !== application.id);
        },
        error: (error) => {
          console.error('Error removing application from favorites, ID:', application.id, error);
        }
      });
    }
  }

  isFavorite(application: any): boolean {
    return application.isFavorite || this.favoriteCandidates.some(fc => fc.id === application.id);
  }

  viewProfile(application: any): void {
    console.log('Viewing profile for candidate ID:', application.candidate.id);
    this.recruiterDashboardService.getCandidateDetails(application.candidate.id).subscribe({
      next: (response) => {
        console.log('Candidate details loaded successfully:', response.data);
        this.selectedProfile = {
          ...application.candidate,
          ...response.data,
          dateOfBirth: response.data.dateOfBirth ? new Date(response.data.dateOfBirth) : null,
          diploma: response.data.diploma,
          yearsOfExperience: response.data.yearsOfExperience,
          phoneNumber: response.data.phoneNumber,
          technicalSkills: response.data.technicalSkills ,
          softSkills: response.data.softSkills
        };
        // Set the selectedApplicationOffer to include the offer title
        this.selectedApplicationOffer = application.offer || { description: 'Unknown Offer' };
      },
      error: (error) => {
        console.error('Error loading candidate details for ID:', application.candidate.id, error);
      }
    });
  }

  closeProfileModal() {
    this.selectedProfile = null;
  }

  backToListOffers(): void {
    console.log('Returning to list of offers...');
    this.applications = [];
    this.currentView = 'offers';
    this.offersTab = 'my-offers';
  }

  onSubmitSettings() {
    if (this.settingsForm.valid) {
      this.successMessage = 'Paramètres enregistrés avec succès !';
      this.errorMessage = null;
      setTimeout(() => {
        this.successMessage = null;
      }, 3000);
    } else {
      this.errorMessage = 'Veuillez remplir correctement le formulaire.';
      this.successMessage = null;
    }
  }

  logout(): void {
    console.log('Initiating logout...');
    this.authRedirectService.logout();
    setTimeout(() => {
      this.logoutMessage = null;
    }, 3000);
  }

  sortByDate(event: Event) {
    const selectedDate = (event.target as HTMLInputElement).value;
    if (!selectedDate) {
      this.topScorers = [...this.originalTopScorers];
      return;
    }
    this.topScorers = this.originalTopScorers.filter(scorer => scorer.date === selectedDate);
  }
}
