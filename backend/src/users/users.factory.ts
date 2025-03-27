import { UsersBuilder } from './builders/users.builder';
import { Users } from './entities/users.entity';

export class UserFactory{
  
  static createUser(username: string, password: string, firstName: string, lastName: string): Users {
    return new UsersBuilder()
      .setUsername(username)
      .setPassword(password)
      .setFirstName(firstName)
      .setLastName(lastName)
      .setLastConnectionAt(new Date())
      .setIsPremium(false)
      .setRequestCount(0)
      .build();
  }

  static createPremiumUser(username: string, password: string, firstName: string, lastName: string): Users {
    return new UsersBuilder()
      .setUsername(username)
      .setPassword(password)
      .setFirstName(firstName)
      .setLastName(lastName)
      .setLastConnectionAt(new Date())
      .setIsPremium(true)
      .setRequestCount(0)
      .build();
  }

}
