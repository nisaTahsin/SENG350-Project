import { User } from '../user/user.entity'; // Your User entity

export interface RequestWithUser {
  user?: User;
}
