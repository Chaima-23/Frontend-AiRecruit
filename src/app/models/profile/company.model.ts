import { RecruiterModel } from '../idm/recruiter.model';

export interface CompanyModel {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  description: string;
  field: string;
  phoneNumber: string;
  size: number;
  website: string;
  recruiters: RecruiterModel[];


}
