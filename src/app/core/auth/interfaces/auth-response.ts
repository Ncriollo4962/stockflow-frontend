import { Usuario } from './usuario';

export interface AuthResponse {
  user: Usuario;
  token: string;
  accessToken: string;
  refreshToken: string;
}
