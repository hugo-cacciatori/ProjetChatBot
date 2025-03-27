export class RegisterAccountRequestDto {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    isPremium: boolean;

    constructor(username: string, firstName: string, lastName: string, password: string, isPremium: boolean) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.isPremium = isPremium;
    }

}
