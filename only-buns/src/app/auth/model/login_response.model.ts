import { User } from "../../profile/user.model";

export interface LoginResponse {
    token: string;
    user: User;
  }