export class RegisterAccountRequestDto {
    username: string;
    firstName: string;
    lastName: string;
    password: string;

    constructor(username: string, firstName: string, lastName: string, password: string) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
    }

}
