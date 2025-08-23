export type User = {
  id: number;
  username: string;
  password: string;
};

type Storage = {
  id: string;
  state: "ok" | "error";
};
export type Device = {
  id: number;
  siteId: number;
  title: string;
  description: string;
  model: string;
  version: string;
  enabled: boolean;
  connected: boolean;
  timezone: string;
  storage: Storage[];
};
export type Site = {
  id: number;
  title: string;
  owner: number;
};

export type LoginResult =
  | { success: true; user: User }
  | { success: boolean; error?: string };

export type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  loading: boolean;
};
