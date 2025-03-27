import { Users } from '../entities/users.entity';
import { GeneratedRequest } from 'src/generated-request/entities/generated-request.entity';

export class UsersBuilder {
  private user: Users;

  constructor() {
    this.user = new Users();
  }

  setUsername(username: string): UsersBuilder {
    this.user.username = username;
    return this;
  }

  setPassword(password: string): UsersBuilder {
    this.user.password = password;
    return this;
  }

  setFirstName(firstName: string): UsersBuilder {
    this.user.firstName = firstName;
    return this;
  }

  setLastName(lastName: string): UsersBuilder {
    this.user.lastName = lastName;
    return this;
  }

  setLastConnectionAt(lastConnectionAt: Date): UsersBuilder {
    this.user.lastConnection_At = lastConnectionAt;
    return this;
  }

  setIsPremium(isPremium: boolean): UsersBuilder {
    this.user.isPremium = isPremium;
    return this;
  }

  build(): Users {
    return this.user;
  }
}