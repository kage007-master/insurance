import Coverage from "../models/Coverage";
import CoverageHistory from "../models/CoverageHistory";
import { Response, Request } from "express";
import User from "../models/User";
import TransactionHistory from "../models/TransactionHistory";
import interactor from "../services/interactor";

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
  subscribe: async (req: any, res: Response): Promise<void> => {
    try {
      let user = await User.findOne({ _id: req.user.id });
      if (!user) {
        res.status(400).json({ errors: { msg: "User not found!" } });
        return;
      }

      const active_coverages = await CoverageHistory.find({
        clientID: req.user.id,
        subscription_date: { $lt: new Date() },
        expire_date: { $gt: new Date() },
      });
      if (
        active_coverages.find(
          (_coverage: any) => _coverage.coverageID === req.params.id
        )
      ) {
        res.status(400).json({ errors: { msg: "Already subscribed!" } });
        return;
      }

      let coverage = await Coverage.findOne({ _id: req.params.id });
      interactor.TransferAsset(user._id as string, coverage?.premium);

      let coverage_history = new CoverageHistory({
        coverageID: req.params.id,
        clientID: req.user.id,
        subscription_date: new Date(),
        expire_date: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ),
        paid_amount: coverage?.premium,
      });
      coverage_history.save();

      let transaction_history = new TransactionHistory({
        clientID: req.user.id,
        amount: coverage?.premium,
        date: new Date(),
      });
      transaction_history.save();
    } catch (error) {
      res.status(500).send("Server error");
    }
  },
};
