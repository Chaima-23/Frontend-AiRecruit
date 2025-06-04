import { Component } from '@angular/core';
import {DiscoverComponent} from '../../../shared/components/discover/discover.component';
import {FooterComponent} from '../../../shared/components/footer/footer.component';


@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    DiscoverComponent,
    FooterComponent,
  ],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {



}
