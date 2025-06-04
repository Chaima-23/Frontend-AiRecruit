import { UserModel } from './user.model';

export interface AdministratorModel extends UserModel {
  createdAt: Date;
  status?: string;
}
