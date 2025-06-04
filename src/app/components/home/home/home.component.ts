import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {NavbarComponent} from '../../../shared/components/navbar/navbar.component';
import {AboutUsComponent} from '../about-us/about-us.component';


@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    NavbarComponent,
    AboutUsComponent,
    ]
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToAboutUs() {
    this.router.navigate(['/about']);
  }



}
