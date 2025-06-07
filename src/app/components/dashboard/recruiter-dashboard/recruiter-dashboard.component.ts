import { Component, AfterViewInit } from '@angular/core'; // Ajout de AfterViewInit pour le graphique
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import Chart from 'chart.js/auto';
import { AuthRedirectService } from '../../../core/services/Auth-redirect.service';

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
  isEditing: boolean = false; // Ajout de la variable isEditing

  // Formulaires
  settingsForm: FormGroup;
  offerForm: FormGroup;

  // Données pour les graphiques
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
    {
      name: 'Jane Cooper',
      title: 'Cloud Engineer',
      percentage: '99.99%',
      rank: '1st',
      date: '2025-05-01'
    },
    {
      name: 'Eleanor Pena',
      title: 'Cybersecurity Specialist',
      percentage: '99.76%',
      rank: '2nd',
      date: '2025-05-01'
    },
    {
      name: 'Devon Lane',
      title: 'Web Developer',
      percentage: '99.50%',
      rank: '3rd',
      date: '2025-05-01'
    }
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

  // Données statiques pour le tableau
  offers: any[] = [
    { id: 1, description: 'Software Engineer', applications: 5, offerType: 'Full-time', status: 'Active' },
    { id: 2, description: 'Marketing Intern', applications: 3, offerType: 'Internship', status: 'Expired' },
    { id: 3, description: 'Designer', applications: 2, offerType: 'Part-time', status: 'Active' }
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authRedirectService: AuthRedirectService
  ) {
    // Initialisation du formulaire des paramètres
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

    // Initialisation du formulaire des offres
    this.offerForm = this.fb.group({
      description: ['', Validators.required],
      field: ['', Validators.required],
      country: ['', Validators.required],
      otherCountry: [''],
      city: ['', Validators.required],
      minQualifications: ['', Validators.required],
      duties: ['', Validators.required],
      tools: ['', Validators.required],
      salary: ['', Validators.required],
      deadline: ['', Validators.required],
      workMode: ['', Validators.required],
      status: ['Active', Validators.required],
      offerType: ['', Validators.required],
      position: [''],
      workingHours: [''],
      benefits: [''],
      contractType: [''],
      schedule: [''],
      startDate: [''],
      endDate: ['']
    });
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
    this.isEditing = false; // Réinitialiser isEditing lors du changement d'onglet
    this.offerForm.reset();
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
    // Réinitialiser les champs conditionnels
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
      if (this.isEditing) {
        // Mise à jour de l'offre existante
        const updatedOffer = { ...this.offerForm.value, id: this.selectedOffer.id, applications: this.selectedOffer.applications };
        this.offers = this.offers.map(offer => (offer.id === updatedOffer.id ? updatedOffer : offer));
        this.successMessage = 'Offer updated successfully!';
        this.isEditing = false;
        this.selectedOffer = null;
      } else {
        // Création d'une nouvelle offre
        const newOffer = { ...this.offerForm.value, id: this.offers.length + 1, applications: 0 };
        this.offers.push(newOffer);
        this.successMessage = 'Offer posted successfully!';
      }
      this.errorMessage = null;
      this.offerForm.reset();
      this.showOtherCountry = false;
      this.offerType = '';
      setTimeout(() => {
        this.successMessage = null;
      }, 3000);
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
      this.successMessage = null;
    }
  }

  updateOffer(offer: any) {
    this.selectedOffer = offer;
    this.isEditing = true;
    this.offersTab = 'post'; // Passer à l'onglet "Post" pour éditer
    this.offerType = offer.offerType;
    this.showOtherCountry = offer.country === 'other';
    // Pré-remplir le formulaire avec les données de l'offre sélectionnée
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
      status: offer.status || 'Active',
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
    this.offersTab = 'my-offers'; // Retourner à la vue "My Offers"
  }

  deleteOffer(offer: any) {
    console.log('Delete offer:', offer);
    this.offers = this.offers.filter(o => o.id !== offer.id); // Correction : utiliser l'id au lieu de l'objet
  }

  viewApplications(offer: any) {
    console.log('View applications for offer:', offer);
    // Logique pour voir les applications
  }

  onSubmitSettings() {
    if (this.settingsForm.valid) {
      this.successMessage = 'Settings saved successfully!';
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

  sortByDate(event: Event) {
    const selectedDate = (event.target as HTMLInputElement).value;
    if (!selectedDate) {
      this.topScorers = [...this.originalTopScorers];
      return;
    }
    this.topScorers = this.originalTopScorers.filter(scorer => scorer.date === selectedDate);
  }
}
