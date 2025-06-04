import { OfferModel } from './offer.model';
import { RecruiterModel } from '../idm/recruiter.model'

export interface JobOfferModel extends OfferModel {
  position: string;
  workingHours: number;

}
