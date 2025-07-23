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
    { name: 'Chahd Maaloul', title: 'IT Support Intern', percentage: '90%', rank: '1st', date: '2025-06-20' },
    { name: 'Youssef Zidi', title: 'Cybersecurity Specialist', percentage: '85%', rank: '2nd', date: '2025-05-30' },
    { name: 'Salma Koubaa', title: 'Web Developer', percentage: '70%', rank: '3rd', date: '2025-06-17' }
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

// Static data for applications
  applicationCounts: { [key: string]: number } = {
    app1: 5,
    app2: 3,
    app3: 8,
    app4: 1
  };
  applications: any[] = [
    {
      id: 'app1',
      firstName: 'Mariem',
      description: 'Software Engineer',
      yearsOfExperience: 5,
      diploma: 'Master in Computer Science',
      date: new Date('2025-06-20'),
      isFavorite: false,
      candidate: {
        id: 'cand1',
        firstName: 'Mariem',
        lastName: 'Jelassi',
        email: 'Mariem@example.com',
        phone: "+216-50-678-321",
        country: 'USA',
        city: 'New York',
        address: '123 Main St',
        dateOfBirth: new Date('1995-05-15'),
        specialization: 'Software Development',
        technicalSkills: ['Java', 'Python', 'SQL'],
        softSkills: ['Communication', 'Teamwork'],
        score: '85%' // Added score
      },
      offer: { id: 'offer1', description: 'Software Engineer Position' }

    },
    {
      id: 'app2',
      firstName: 'Chaima',
      description: 'Data Analyst',
      yearsOfExperience: 3,
      diploma: 'Bachelor in Statistics',
      date: new Date('2025-06-15'),
      isFavorite: false,
      candidate: {
        id: 'cand2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'chaima.zidi@example.com',
        phone: '+216-93-124-968',
        country: 'Canada',
        city: 'Toronto',
        address: '456 Oak Ave',
        dateOfBirth: new Date('1998-08-20'),
        specialization: 'Data Analysis',
        technicalSkills: ['Excel', 'R', 'Tableau'],
        softSkills: ['Problem Solving', 'Attention to Detail'],
        score: '90%' // Added score
      },
      offer: { id: 'offer2', description: 'Data Analyst Role' }
    },
    {
      id: 'app1',
      firstName: 'Chahd',
      description: 'IT Support Intern',
      yearsOfExperience: 1,
      diploma: 'Bachelor in Computer Science',
      date: new Date('2025-06-20'),
      isFavorite: false,
      candidate: {
        id: 'cand1',
        firstName: 'Chahd',
        lastName: 'Maaloul',
        email: 'chahd.maaloul23@gmail.com',
        phone: '54126038',
        country: 'Tunisia',
        city: 'Sfax',
        address: 'Gremda km4',
        dateOfBirth: new Date('2003-04-20'),
        specialization: 'Big Data',
        technicalSkills: ['Data flow', 'cloud functions'],
        softSkills: ['Communication'],
        score: '90%'
      },
      offer: { id: 'offer1', description: 'IT Support Intern' }
    }

  ];
  favoriteCandidates: any[] = [];
  selectedProfile: CandidateModel | null = null;
  selectedApplicationOffer: OfferModel | null = null;

  viewApplications(offer: any): void {
    console.log('Viewing applications for offer ID:', offer.id);
    this.selectedApplicationOffer = offer;
    this.currentView = 'applications';
  }

  toggleFavorite(application: any): void {
    console.log('Toggling favorite status for application ID:', application.id);
    application.isFavorite = !application.isFavorite;
    if (application.isFavorite) {
      console.log('Application added to favorites successfully, ID:', application.id);
      if (!this.favoriteCandidates.some(fc => fc.id === application.id)) {
        this.favoriteCandidates.push({ ...application, isFavorite: true });
      }
    } else {
      console.log('Application removed from favorites successfully, ID:', application.id);
      this.favoriteCandidates = this.favoriteCandidates.filter(fc => fc.id !== application.id);
    }
  }

  isFavorite(application: any): boolean {
    return application.isFavorite || this.favoriteCandidates.some(fc => fc.id === application.id);
  }

  viewProfile(application: any): void {
    console.log('Viewing profile for candidate ID:', application.candidate.id);
    this.selectedProfile = { ...application.candidate };
    this.selectedApplicationOffer = application.offer || { description: 'Unknown Offer' };
  }

  closeProfileModal() {
    this.selectedProfile = null;
  }

  acceptApplication() {
    console.log('Application accepted for candidate:', this.selectedProfile?.firstName);
    this.showSuccessMessage = true;
    this.showErrorMessage = false;
    setTimeout(() => {
      this.showSuccessMessage = false;
      this.selectedProfile = null;
    }, 2000); // Hide message after 2 seconds
  }

  rejectApplication() {
    console.log('Application rejected for candidate:', this.selectedProfile?.firstName);
    this.showErrorMessage = true;
    this.showSuccessMessage = false;
    setTimeout(() => {
      this.showErrorMessage = false;
      this.selectedProfile = null;
    }, 2000); // Hide message after 2 seconds
  }

  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;

  backToListOffers(): void {
    console.log('Returning to list of offers...');
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
