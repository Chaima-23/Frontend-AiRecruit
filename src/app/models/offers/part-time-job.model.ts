import { JobOfferModel } from './job-offer.model';


export interface PartTimeJobModel extends JobOfferModel {
  schedule: string;

}
