import { Response, Request } from "express";
import Weather from "../models/Weather";

export default {
  getAll: async (req: any, res: Response): Promise<void> => {
    let weathers = await Weather.find({});
    res.json(weathers);
  },
};
