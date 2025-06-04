import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-corporate',
  templateUrl: './corporate.component.html',
  styleUrls: ['./corporate.component.css']
})
export class CorporateComponent {
  constructor(private router: Router) { }

  redirectedToSignUpCandidate(): void {
    this.router.navigate(['auth/sign-up-candidate']);
  }

  redirectedToSignUpRecruiter(): void {
    this.router.navigate(['auth/sign-up-recruiter']);
  }



}
