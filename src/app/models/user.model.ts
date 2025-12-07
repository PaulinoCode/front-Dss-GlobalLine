export interface UserModel {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'MANAGER';
}
