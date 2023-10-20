import Coverage from "../models/Coverage";
import { Response, Request } from "express";

export default {
  get: async (req: any, res: Response): Promise<void> => {
    let coverages = await Coverage.find({});
    res.json(coverages);
  },
  add: async (req: any, res: Response): Promise<void> => {
    const { name, weather, premium, reimbursement, threshold } = req.body;

    try {
      let coverage = await Coverage.findOne({ weather });

      if (coverage) {
        res.status(400).json({ errors: { msg: "Coverage already exists" } });
        return;
      }

      coverage = new Coverage({
        name,
        weather,
        premium,
        reimbursement,
        threshold,
      });

      coverage.save();

      res.json(coverage);
    } catch (error) {
      res.status(500).send("Server error");
    }
  },
  subscribe: async (req: Request, res: Response): Promise<void> => {},
};
