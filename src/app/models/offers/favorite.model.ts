
import { OfferModel } from './offer.model';
import {RecruiterModel} from '../idm/recruiter.model';

export interface FavoriteModel {
  id: string;
  recruiter: RecruiterModel;
  offer: OfferModel;
}
