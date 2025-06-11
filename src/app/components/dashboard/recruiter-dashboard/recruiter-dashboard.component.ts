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

  offers: any[] = [];

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
      minQualifications: ['', [Validators.required]],
      duties: ['', [Validators.required]],
      tools: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      deadline: ['', [Validators.required]],
      workMode: ['', [Validators.required]],
      status: ['ACTIVE', [Validators.required]],
      offerType: ['', [Validators.required]],
      position: [''],
      workingHours: ['', [Validators.pattern(/^\d+$/), Validators.min(1)]],
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
      this.recruiterDashboardService.getMyOffers().subscribe({
        next: (response) => {
          this.offers = response.data;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors du chargement des offres : ' + (error.error?.message || error.message);
          console.error('Erreur chargement offres:', error);
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
        this.successMessage = 'La mise à jour des offres n\'est pas encore implémentée.';
      } else {
        switch (formValue.offerType) {
          case 'Full-time':
            const fullTimeJob: FullTimeJobModel = {
              ...baseOffer,
              position: formValue.position || '',
              workingHours: parseInt(formValue.workingHours || '0', 10),
              benefits: formValue.benefits || '',
              contractType: formValue.contractType || ''
            };
            this.recruiterDashboardService.createFullTimeJob(fullTimeJob).subscribe({
              next: (response) => {
                this.offers.push(response.data);
                this.successMessage = response.message;
                this.errorMessage = null;
                this.offerForm.reset();
                this.showOtherCountry = false;
                this.offerType = '';
                setTimeout(() => this.successMessage = null, 3000);
              },
              error: (error) => {
                this.errorMessage = 'Erreur lors de la création de l\'offre : ' + (error.error?.message || error.message);
                this.successMessage = null;
                console.error('Erreur création offre:', error);
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
            this.recruiterDashboardService.createPartTimeJob(partTimeJob).subscribe({
              next: (response) => {
                this.offers.push(response.data);
                this.successMessage = response.message;
                this.errorMessage = null;
                this.offerForm.reset();
                this.showOtherCountry = false;
                this.offerType = '';
                setTimeout(() => this.successMessage = null, 3000);
              },
              error: (error) => {
                this.errorMessage = 'Erreur lors de la création de l\'offre : ' + (error.error?.message || error.message);
                this.successMessage = null;
                console.error('Erreur création offre:', error);
              }
            });
            break;
          case 'Internship':
            const internshipOffer: InternshipOfferModel = {
              ...baseOffer,
              startDate: formValue.startDate,
              endDate: formValue.endDate
            };
            this.recruiterDashboardService.createInternshipOffer(internshipOffer).subscribe({
              next: (response) => {
                this.offers.push(response.data);
                this.successMessage = response.message;
                this.errorMessage = null;
                this.offerForm.reset();
                this.showOtherCountry = false;
                this.offerType = '';
                setTimeout(() => this.successMessage = null, 3000);
              },
              error: (error) => {
                this.errorMessage = 'Erreur lors de la création de l\'offre : ' + (error.error?.message || error.message);
                this.successMessage = null;
                console.error('Erreur création offre:', error);
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
    console.log('Delete offer:', offer);
    this.offers = this.offers.filter(o => o.id !== offer.id);
  }

  viewApplications(offer: any) {
    console.log('View applications for offer:', offer);
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
