import { Response, Request } from "express";
import Weather from "../models/Weather";
import interactor from "../services/interactor";
import Coverage from "../models/Coverage";

export default {
  getAll: async (req: any, res: Response): Promise<void> => {
    let weathers = await interactor.GetAllEvents();
    const result: any[] = [];
    for (var i = 0; i < weathers.length; i++) {
      const event = await Weather.findById(weathers[i].ID);
      const coverage = await Coverage.findOne({ weather: weathers[i].weather });
      result.push({
        ...weathers[i],
        key: weathers[i].ID,
        url: event?.url,
        validator:
          weathers[i].raised &&
          (weathers[i].confirmed * 100) / weathers[i].raised <
            coverage?.threshold
            ? "Required"
            : "N/A",
      });
    }
    res.json(result);
  },
};
