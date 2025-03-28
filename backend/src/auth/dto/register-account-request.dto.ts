export class RegisterAccountRequestDto {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    isAdmin: boolean;

    constructor(username: string, firstName: string, lastName: string, password: string, isAdmin: boolean) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.isAdmin = isAdmin;
    }

}
