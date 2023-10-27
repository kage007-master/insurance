import { Response, Request } from "express";
import Weather from "../models/Weather";
import interactor from "../services/interactor";

export default {
  getAll: async (req: any, res: Response): Promise<void> => {
    let weathers = await Weather.find({});
    const result: any[] = [];
    for (var i = 0; i < weathers.length; i++) {
      const event = await interactor.ReadAsset(weathers[i]._id as string);
      result.push({
        ...weathers[i]._doc,
        raised_claims: event.raised,
        confirmed_damage: event.confirmed,
      });
    }
    res.json(result);
    res.json(weathers);
  },
};
