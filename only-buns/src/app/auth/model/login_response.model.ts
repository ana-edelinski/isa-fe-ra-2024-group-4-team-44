import { User } from "../../profile/user.model";

export interface LoginResponse {
    accessToken: string;
    expiresIn: number;
    userId: number;
  }