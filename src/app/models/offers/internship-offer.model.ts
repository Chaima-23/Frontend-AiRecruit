import { OfferModel } from './offer.model';

export interface InternshipOfferModel extends OfferModel {
  startDate: Date;
  endDate: Date;


}
