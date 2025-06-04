import { UserModel} from './user.model';

export interface CandidateModel extends UserModel {
  address: string;
  dateOfBirth: Date;
  diploma: string;
  experience: string;
  phoneNumber: string;
  country?: string;
  city?: string;
  softSkills: string;
  techSkills: string;

}
