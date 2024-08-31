export class User {
  [k: string]: any;
  id: number = 0;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  role: number = 1 | 2 | 3;
  password: string = '';
}
