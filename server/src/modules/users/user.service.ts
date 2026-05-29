import seedUsers from "../../db/seed/users.json";
import { BadRequestError } from "../../core/errors";
import type { CreateUserInput, UpdateUserInput, User, UserRecord } from "./types";

type SeedUser = {
  username: string;
  email: string;
  plainPassword: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string;
  image: string;
};

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const toPublic = ({ password: _password, ...user }: UserRecord): User => user;

const toRecord = (raw: SeedUser, id: string): UserRecord => ({
  id,
  username: raw.username,
  email: raw.email.toLowerCase(),
  password: raw.plainPassword,
  role: raw.role,
  firstName: raw.firstName,
  lastName: raw.lastName,
  phone: raw.phone,
  image: raw.image,
});

let users: UserRecord[] = (seedUsers as SeedUser[]).map((raw, index) => toRecord(raw, String(index + 1)));

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const validateCreateInput = (input: CreateUserInput): void => {
  if (!input.username?.trim()) throw new BadRequestError("username is required");
  if (!input.email?.trim()) throw new BadRequestError("email is required");
  if (!input.password?.trim()) throw new BadRequestError("password is required");
  if (!input.firstName?.trim()) throw new BadRequestError("firstName is required");
  if (!input.lastName?.trim()) throw new BadRequestError("lastName is required");
  if (!input.role?.trim()) throw new BadRequestError("role is required");
};

export const userService = {
  getUsers(): UserRecord[] {
    return users;
  },

  setUsers(next: UserRecord[]): void {
    users = next;
  },

  toPublic,

  toPublicList(records: UserRecord[]): User[] {
    return records.map(toPublic);
  },

  isUsernameTaken(username: string, excludeUserId?: string): boolean {
    const normalized = username.trim().toLowerCase();
    return users.some(
      (u) => u.username.toLowerCase() === normalized && u.id !== excludeUserId,
    );
  },

  isEmailTaken(email: string, excludeUserId?: string): boolean {
    const normalized = normalizeEmail(email);
    return users.some((u) => u.email === normalized && u.id !== excludeUserId);
  },

  create(input: CreateUserInput): User {
    validateCreateInput(input);

    const username = input.username.trim();
    const email = normalizeEmail(input.email);

    if (this.isUsernameTaken(username)) {
      throw new BadRequestError("username is already taken");
    }
    if (this.isEmailTaken(email)) {
      throw new BadRequestError("email is already taken");
    }

    const newUser: UserRecord = {
      id: makeId(),
      username,
      email,
      password: input.password,
      role: input.role.trim(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      phone: input.phone?.trim() ?? "",
      image: input.image?.trim() ?? "",
    };

    users = [...users, newUser];
    return toPublic(newUser);
  },

  applyUpdate(current: UserRecord, input: UpdateUserInput): UserRecord {
    if (input.username !== undefined) {
      const username = input.username.trim();
      if (!username) throw new BadRequestError("username cannot be empty");
      if (this.isUsernameTaken(username, current.id)) {
        throw new BadRequestError("username is already taken");
      }
    }

    if (input.email !== undefined) {
      const email = normalizeEmail(input.email);
      if (!email) throw new BadRequestError("email cannot be empty");
      if (this.isEmailTaken(email, current.id)) {
        throw new BadRequestError("email is already taken");
      }
    }

    return {
      ...current,
      username: input.username?.trim() ?? current.username,
      email: input.email !== undefined ? normalizeEmail(input.email) : current.email,
      password: input.password?.trim() ? input.password : current.password,
      role: input.role?.trim() ?? current.role,
      firstName: input.firstName?.trim() ?? current.firstName,
      lastName: input.lastName?.trim() ?? current.lastName,
      phone: input.phone?.trim() ?? current.phone,
      image: input.image?.trim() ?? current.image,
    };
  },

  reset(): void {
    users = (seedUsers as SeedUser[]).map((raw, index) => toRecord(raw, String(index + 1)));
  },
};
