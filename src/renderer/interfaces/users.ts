export enum USER_ROLE {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  _id: string;
  email: string;
  profileIcon: string;
  hasSpotifyAccess: string;
  role: USER_ROLE;
}
