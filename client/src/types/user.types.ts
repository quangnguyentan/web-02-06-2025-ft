export type User = {
  _id?: string;
  typeLogin: string; // Required
  id: string;
  tokenLogin: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  refreshToken?: string;
  avatar?: string;
  role: "USER" | "ADMIN";
  level: number;
  total_score: number;
  address: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  enrolledCoursesCount: number;
  phoneNumber: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordChangedAt?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
export enum RoleType {
  USER = "USER",
  ADMIN = "ADMIN",
}
