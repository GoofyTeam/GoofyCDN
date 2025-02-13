export type User = {
  id: string;
  email: string;
};

export type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
};

export interface AuthFunctions {
  login: (user: User, jwt: string) => Promise<void>;
  logout: () => Promise<void>;
  update: (user: Partial<User>) => Promise<void>;
}
