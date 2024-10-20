
export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  avatar: string;
  isVerified: boolean;
  emailVerification: boolean;
  googleAuth?: boolean;
  otp?: string;
  tokenExpirationTime?: Date;
}
