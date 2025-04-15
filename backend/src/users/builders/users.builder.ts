import { User } from '../entities/user.entity';

export class UsersBuilder {
  private user: User;

  constructor() {
    this.user = new User();
    this.user.created_At = new Date();
  }
}
