import { UserRole } from '../../users/schemas/user.schema';

export interface CurrentUserData {
  userId: string;
  email: string;
  role: UserRole;
}
