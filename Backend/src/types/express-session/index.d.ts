import { SessionData } from "express-session"
import { User } from "../../models/user";

declare module 'express-session' {
  export interface SessionData {
    user: User;
    isLogined: boolean;
  }
}