import { RecruiterModel } from '../idm/recruiter.model';

export interface CompanyModel {
  id: string;
  name: string;
  size: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  description: string;
  field: string;
  phoneNumber1: string;
  phoneNumber2: string;
  website: string;
  recruiter: RecruiterModel;
}
