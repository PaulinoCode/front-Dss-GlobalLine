export interface ClientM {
  id?: number; // El signo ? es porque al crear uno nuevo, aún no tiene ID
  name: string;
  email: string;
  phone: string;
}
