import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxChartsModule
  ],
  templateUrl: './candidate-dashboard.component.html',
  styleUrls: ['./candidate-dashboard.component.css']
})
export class CandidateDashboardComponent {
  constructor(private router: Router) {
  }

  currentView: string = 'dashboard';
  logoutMessage: string | null = null;

  // Data for Daily Profile Views bar chart (ngx-charts format)
  dailyViewsData = [
    { name: 'M', value: 60 },
    { name: 'Tu', value: 80 },
    { name: 'W', value: 40 },
    { name: 'Th', value: 50 },
    { name: 'F', value: 70 },
    { name: 'Sa', value: 30 },
    { name: 'Su', value: 20 }
  ];

  topScorers = [
    {
      name: 'Jane Cooper',
      title: 'Cloud Engineer',
      percentage: '99.99%',
      rank: '1st',
    },
    {
      name: 'Eleanor Pena',
      title: 'Cybersecurity Specialist',
      percentage: '99.76%',
      rank: '2nd',
    },
    {
      name: 'Devon Lane',
      title: 'Web Developer',
      percentage: '99.50%',
      rank: '3rd',
    }
  ];


  // Data for Candidates pie chart (Chart.js format)
  candidatesChartData = {
    labels: ['Females', 'Males'],
    datasets: [{
      label: 'Candidates Distribution',
      data: [175, 75], // 70% Females (175), 30% Males (75) of 250 candidates
      backgroundColor: ['#1a73e8', '#b3e5fc'],
      borderWidth: 0,
      hoverBackgroundColor: ['#1a73e8', '#b3e5fc']
    }]
  };


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
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              callbacks: {
                label: (tooltipItem) => {
                  const label = tooltipItem.label || '';
                  const value = tooltipItem.raw || 0;
                  return `${label}: ${value}`;
                }
              },
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


  // Gestion de la déconnexion

  logout(): void {
    this.logoutMessage = 'You are logged out from your space';
    this.router.navigate(['']);
    setTimeout(() => {
      this.logoutMessage = null;
    }, 3000);
  }

}
