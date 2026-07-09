import { UserRole } from "../../../generated/prisma/enums";


export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  role: UserRole;
}


export interface IUpdateUserRequest {
  name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}