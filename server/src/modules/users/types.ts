export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string;
  image: string;
}

export interface UserRecord extends User {
  password: string;
}

export type CreateUserInput = Omit<User, "id"> & { password: string };

export type UpdateUserInput = Partial<CreateUserInput>;
