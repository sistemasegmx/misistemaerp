import { UserModel } from "./user.model";

export class FormatResponse {
  status: number;
  message: string;
  data: {}
}

export class AuthResponse {
  status: number;
  message: string;
  data: UserModel;
}

export class AuthModel {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expiresIn: string;

  setAuth(auth: AuthModel) {
    this.access_token = auth.access_token;
    this.refresh_token = auth.refresh_token;
    this.expires_at = auth.expires_at;
    this.expiresIn = auth.expiresIn;
  }
}
