import { UserEntity } from '../../user/user.entity';

export interface IAuthorizedRequest extends Request {
  user: UserEntity;
  country?: string;
}
