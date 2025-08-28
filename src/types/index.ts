export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: string;
  createdAt?: string;
}

export interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: React.ComponentType<string>;
  read: boolean;
}
