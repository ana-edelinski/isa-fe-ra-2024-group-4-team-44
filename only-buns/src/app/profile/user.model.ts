export class User {
    id?: number;
    email: string = '';
    username: string = '';
    name: string = '';
    surname: string = '';
    password?: string;
    confirmPassword?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    avatar?: string;
  }