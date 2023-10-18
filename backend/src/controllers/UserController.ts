import User from "../models/User";
import { Response, Request } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default {
  load: async (req: any, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      res.json(user);
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
    const { fullname, username, email, password } = req.body;

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
        address: "111",
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
