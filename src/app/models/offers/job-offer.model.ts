import { OfferModel } from './offer.model';

export interface JobOfferModel extends OfferModel {
  position: string;
  workingHours: number;

}
