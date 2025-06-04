
import { OfferModel } from './offer.model';
import {UserModel} from '../idm/user.model';

export interface FavoriteModel {
  id: string;
  user: UserModel;
  offer: OfferModel;
}
