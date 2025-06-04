import { RecruiterModel } from '../idm/recruiter.model';

export interface OfferModel {
  id: string;
  deadline: Date;
  description: string;
  dutiesAndResponsibilities: string;
  field: string;
  location: string;
  minQualifications: string;
  salary: number;
  tools: string;
  workMode: string;
  recruiter: RecruiterModel;


}
