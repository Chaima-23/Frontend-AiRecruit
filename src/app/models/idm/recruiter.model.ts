import { UserModel } from './user.model';
import { CompanyModel } from '../profile/company.model';

export interface RecruiterModel extends UserModel {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    jobOffersPosted: number;
    company: CompanyModel;

}
