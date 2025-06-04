import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent {
  constructor(private router: Router) { }

  redirectedToGetStarted(): void {
    this.router.navigate(['auth/get-started']);
  }



}
