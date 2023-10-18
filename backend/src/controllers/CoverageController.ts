import User from "../models/User";
import { Response, Request } from "express";

export default {
  get: async (req: any, res: Response): Promise<void> => {},
  add: async (req: any, res: Response): Promise<void> => {},
  subscribe: async (req: Request, res: Response): Promise<void> => {},
  signup: async (req: Request, res: Response): Promise<void> => {},
};
