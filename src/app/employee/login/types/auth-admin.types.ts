export type LoginDto = {
  email: string;
  password: string;
};

export interface AuthResponse {
  token: string;
  payload: {
    id: string;
    role: string;
    email: string;
    outletId?: string | null;
  };
}
