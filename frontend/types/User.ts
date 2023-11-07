export type UserType = {
  id?: number;
  name: string;
  provider: string;
  uid: string;
  tokens: number;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
};