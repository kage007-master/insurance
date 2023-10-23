import User from "../models/User";
import { Response, Request } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import CoverageHistory from "../models/CoverageHistory";
import TransactionHistory from "../models/TransactionHistory";

export default {
  getClients: async (req: any, res: Response): Promise<void> => {
    try {
      let clients = await User.find({ role: "customer" });
      res.json(clients);
    } catch (err) {
      res.status(500).send("Server Error");
    }
  },

  getClient: async (req: any, res: Response): Promise<void> => {},

  load: async (req: any, res: Response): Promise<void> => {
    try {
      let user = await User.findById(req.user.id).select("-password");
      if (user?.role === "customer") {
        const active_coverages = await CoverageHistory.find({
          clientID: req.user.id,
          subscription_date: { $lt: new Date() },
          expire_date: { $gt: new Date() },
        });
        const transaction_histories = await TransactionHistory.find({
          clientID: req.user.id,
        })
          .sort({ date: -1 })
          .limit(2);
        res.json({ user, active_coverages, transaction_histories });
        return;
      }
      res.json({ user });
    } catch (err) {
      res.status(500).send("Server Error");
    }
  },

  login: async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        res.status(400).json({ errors: { msg: "Invalid Credentials" } });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(400).json({ errors: { msg: "Invalid Credentials" } });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "password",
        { expiresIn: "5 days" },
        (err: any, token: any) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).send("Server error");
    }
  },
  signup: async (req: Request, res: Response): Promise<void> => {
    const {
      fullname,
      username,
      email,
      password,
      line1,
      line2,
      city,
      latitude,
      longitude,
    } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        res.status(400).json({ errors: { msg: "User already exists" } });
        return;
      }

      user = new User({
        fullname,
        username,
        email,
        password,
        address: { line1, line2, city, latitude, longitude },
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "password",
        { expiresIn: "5 days" },
        (err: any, token: any) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      res.status(500).send("Server error");
    }
  },
};
