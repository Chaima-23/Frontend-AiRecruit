import { JobOfferModel } from './job-offer.model';

export interface FullTimeJobModel extends JobOfferModel {
  benefits: string;
  contractType: string;

}
