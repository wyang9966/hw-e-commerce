import { Request, Response } from "express";
import { userService } from "./user.service";
import type { CreateUserInput, UpdateUserInput, UserRecord } from "./types";
import { NotFoundError } from "../../core/errors";

export const getAllUsers = (_req: Request, res: Response) => {
  const data = userService.toPublicList(userService.getUsers());
  res.json({ success: true, data });
};

export const getUserById = (req: Request, res: Response) => {
  const user = userService.getUsers().filter((u) => u.id === req.params.id)[0];
  if (!user) throw new NotFoundError("User not found");
  res.json({ success: true, data: userService.toPublic(user) });
};

export const getUserByUsername = (req: Request, res: Response) => {
  const raw = req.params.username;
  const username = (typeof raw === "string" ? raw : raw[0] ?? "").trim().toLowerCase();
  const user = userService.getUsers().filter((u) => u.username.toLowerCase() === username)[0];
  if (!user) throw new NotFoundError("User not found");
  res.json({ success: true, data: userService.toPublic(user) });
};

export const getUserByEmail = (req: Request, res: Response) => {
  const raw = req.params.email;
  const email = (typeof raw === "string" ? raw : raw[0] ?? "").trim().toLowerCase();
  const user = userService.getUsers().filter((u) => u.email === email)[0];
  if (!user) throw new NotFoundError("User not found");
  res.json({ success: true, data: userService.toPublic(user) });
};

export const createUser = (req: Request, res: Response) => {
  const user = userService.create(req.body as CreateUserInput);
  res.status(201).json({ success: true, data: user });
};

export const updateUser = (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body as UpdateUserInput;

  let updated: UserRecord | undefined;
  const nextUsers = userService.getUsers().map((user) => {
    if (user.id !== id) return user;
    updated = userService.applyUpdate(user, body);
    return updated;
  });

  if (!updated) throw new NotFoundError("User not found");
  userService.setUsers(nextUsers);
  res.json({ success: true, data: userService.toPublic(updated) });
};

export const deleteUser = (req: Request, res: Response) => {
  const { id } = req.params;
  const current = userService.getUsers();
  const nextUsers = current.filter((u) => u.id !== id);
  if (nextUsers.length === current.length) throw new NotFoundError("User not found");
  userService.setUsers(nextUsers);
  res.status(204).send();
};
