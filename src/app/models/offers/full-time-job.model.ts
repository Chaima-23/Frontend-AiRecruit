import { JobOfferModel } from './job-offer.model';
import {RecruiterModel} from '../idm/recruiter.model';

export interface FullTimeJobModel extends JobOfferModel {
  benefits: string;
  contractType: string;

}
