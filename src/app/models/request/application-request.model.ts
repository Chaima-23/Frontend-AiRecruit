import { OfferModel } from '../offers/offer.model';
import { CandidateModel } from '../idm/candidate.model';
import { RequestStatus } from './request-status.enum';

export interface ApplicationRequest {
  id: string;
  date: Date;
  state: RequestStatus;
  offer: OfferModel;
  candidate: CandidateModel;

}
