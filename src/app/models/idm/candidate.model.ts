import { UserModel} from './user.model';

export interface CandidateModel extends UserModel {
  address: string;
  dateOfBirth: Date| null;
  diploma: string;
  yearsOfExperience: number;
  phoneNumber: string;
  country?: string;
  city?: string;
  softSkills: string;
  technicalSkills: string;
  specialization: string;
  score: string;
}
