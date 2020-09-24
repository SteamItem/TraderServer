export interface ICookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  size: number;
  httpOnly: boolean;
  session: boolean;
  secure: boolean;
  sameSite: ISameSite;
}

export type ISameSite = "Strict" | "Lax";

export interface IDuelbitsResponse {
  token: string;
  refresh: string;
  signed: boolean;
  loading: boolean;
  error?: any;
}