import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {NavbarComponent} from '../../../shared/components/navbar/navbar.component';


@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.css'],
  imports:[ NavbarComponent ],
})
export class GetStartedComponent {
  selectedRole: string | null = null;

  constructor(private router: Router) {}

  selectRole(role: string) {
    this.selectedRole = role;
  }

  continue() {
    if (!this.selectedRole) {
      alert('Please select an optwzion to continue.');
      return;
    }
    if (this.selectedRole === 'recruiter') {
      this.router.navigate(['/auth/sign-up-recruiter']);
    } else {
      this.router.navigate(['/auth/sign-up-candidate']);
    }
  }
}
