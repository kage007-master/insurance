import { Response, Request } from "express";
import Weather from "../models/Weather";
import interactor from "../services/interactor";
import Coverage from "../models/Coverage";

export default {
  getAll: async (req: any, res: Response): Promise<void> => {
    let weathers = await Weather.find({}).sort({ date: -1 });
    const result: any[] = [];
    for (var i = 0; i < weathers.length; i++) {
      const event = await interactor.ReadAsset(weathers[i]._id as string);
      const coverage = await Coverage.findOne({ weather: weathers[i].weather });
      result.push({
        ...weathers[i]._doc,
        raised_claims: event.raised,
        confirmed_damage: event.confirmed,
        validator:
          event.raised &&
          (event.confirmed * 100) / event.raised < coverage?.threshold
            ? "Required"
            : "N/A",
      });
    }
    res.json(result);
  },
};
