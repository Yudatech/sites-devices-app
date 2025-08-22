export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
};
export type Device = {
  id: number;
  siteId: number;
  name: string;
  type: string;
  status: "online" | "offline";
  lastSeen: string;
};
export type Site = {
  id: number;
  name: string;
  userId: number;
  location?: string;
  devices?: Device[];
};
