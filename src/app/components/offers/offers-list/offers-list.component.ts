import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import {CorporateSectionComponent} from '../../../shared/components/corporate-section/corporate-section.component';
import {FooterComponent} from '../../../shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { OffersPublicListService } from '../../../core/services/offers-public-list.service';
import { Router } from '@angular/router';
import { OfferModel } from '../../../models/offers/offer.model';

@Component({
  selector: 'app-offers-list',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    CorporateSectionComponent,
    FooterComponent
  ],
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.css']
})
export class OffersListComponent implements OnInit {
  offers: OfferModel[] = [];
  pagedOffers: OfferModel[] = [];
  currentPage = 0;
  itemsPerPage = 6;

  constructor(private offerService: OffersPublicListService, private router: Router) {}

  ngOnInit(): void {
    this.offerService.getPublicOffers().subscribe((data) => {
      this.offers = data;
      this.updatePagedOffers();
    });
  }

  updatePagedOffers(): void {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedOffers = this.offers.slice(start, end);
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.itemsPerPage < this.offers.length) {
      this.currentPage++;
      this.updatePagedOffers();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePagedOffers();
    }
  }

  goToDetails(): void {
    this.router.navigate(['auth/get-started']);
  }

  applyForOffer(): void {
    this.router.navigate(['auth/get-started']);
  }
}
