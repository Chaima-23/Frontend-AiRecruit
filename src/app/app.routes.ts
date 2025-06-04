import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home/home.component';
import { SignInComponent } from './components/auth/sign-in/sign-in.component';
/*import { SignupCandidateComponent } from './components/auth/signup-candidate/signup-candidate.component';
import {SignupRecruiterComponent} from './components/auth/signup-recruiter/signup-recruiter.component';*/
import { OffersListComponent } from './components/offers/offers-list/offers-list.component';
import { OfferDetailsComponent } from './components/offers/offer-details/offer-details.component';
import { ProfileViewComponent } from './components/profile/profile-view/profile-view.component';
import { ProfileEditComponent } from './components/profile/profile-edit/profile-edit.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { CandidateDashboardComponent } from './components/dashboard/candidate-dashboard/candidate-dashboard.component';
import { RecruiterDashboardComponent } from './components/dashboard/recruiter-dashboard/recruiter-dashboard.component';
import { ResultViewComponent } from './components/evaluation/result-view.component';
import { TestAttemptComponent } from './components/evaluation/test-attempt.component';
import { GetStartedComponent } from './components/auth/get-started/get-started.component';
import { AboutUsComponent} from './components/home/about-us/about-us.component';
import {ContactUsComponent} from './components/contact-us/contact-us.component';
import {ForgotPasswordComponent} from './components/auth/forgot-password/forgot-password.component';
import {UnauthorizedComponent} from './errors/unauthorized.component';
import {canActivateAuthRole} from './core/guards/auth-role.guard';



export const routes: Routes = [
  // Page d'accueil
  { path: '', component: HomeComponent, title: 'AIRecruit - Home' },
  { path: 'about', component: AboutUsComponent },
  { path: 'contact', component: ContactUsComponent },


  // Authentification
  //{ path: 'auth/sign-in', component: SignInComponent },
 /* { path: 'auth/sign-up-candidate', component: SignupCandidateComponent },
  { path: 'auth/sign-up-recruiter', component: SignupRecruiterComponent },*/
  {path: 'auth/get-started', component: GetStartedComponent },
  {path: 'auth/forgot-password', component: ForgotPasswordComponent },


  //errors
  {path:'errors/unauthorized', component: UnauthorizedComponent},

  // Offres d'emploi
  { path: 'offers', component: OffersListComponent },
  { path: 'offers/:id', component: OfferDetailsComponent },

  // Profil
  { path: 'profile', component: ProfileViewComponent },
  { path: 'profile/edit', component: ProfileEditComponent },


// Dashboards
  {
    path: 'dashboard/admin',
    component: AdminDashboardComponent,
    canActivate: [canActivateAuthRole],
    data: { expectedRoles: ['ADMIN'] },
    title: 'Admin Dashboard'
  },
  {
    path: 'dashboard/candidate',
    component: CandidateDashboardComponent,
    canActivate: [canActivateAuthRole],
    data: { expectedRoles: ['CANDIDATE'] },
    title: 'Candidate Dashboard'
  },
  {
    path: 'dashboard/recruiter',
    component: RecruiterDashboardComponent,
    canActivate: [canActivateAuthRole],
    data: { expectedRoles: ['RECRUITER'] },
    title: 'Recruiter Dashboard'
  },


  // Évaluation
  { path: 'evaluation/result/:id', component: ResultViewComponent },
  { path: 'evaluation/test/:id', component: TestAttemptComponent },

  // Route non trouvée
  { path: '**', redirectTo: '', pathMatch: 'full' }
];


