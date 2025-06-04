import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-corporate-section',
  templateUrl: './corporate-section.component.html',
  styleUrls: ['./corporate-section.component.css']
})
export class CorporateSectionComponent {
  constructor(private router: Router) { }

  redirectedToGetStarted(): void {
    this.router.navigate(['auth/get-started']);
  }


}
