import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NavbarComponent} from '../../shared/components/navbar/navbar.component';
import {FooterComponent} from '../../shared/components/footer/footer.component';
import {CorporateComponent} from '../../shared/components/corporate/corporate.component';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    CorporateComponent
  ],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  fullName: string = '';
  email: string = '';
  phone: string = '';
  subject: string = '';
  message: string = '';

  sendMessage() {
    console.log('Message sent', {
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      subject: this.subject,
      message: this.message
    });

  }
}
