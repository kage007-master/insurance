import Claim from "../models/Claim";
import { Response, Request } from "express";
import User from "../models/User";
import Weather from "../models/Weather";

export default {
  getAll: async (req: any, res: Response): Promise<void> => {
    let claims = await Claim.find({});
    const result: any[] = [];
    for (var i = 0; i < claims.length; i++) {
      const customer: any = await User.findById(claims[i].clientID);
      result.push({ ...claims[i]._doc, customer_name: customer.fullname });
    }
    res.json(result);
  },
  getActive: async (req: any, res: Response): Promise<void> => {
    let claims = await Claim.find({
      clientID: req.user.id,
      status: "Pending",
    });
    res.json(claims);
  },
  getPast: async (req: any, res: Response): Promise<void> => {
    let claims = await Claim.find({
      clientID: req.user.id,
      status: { $in: ["Approved", "Declined"] },
    });
    res.json(claims);
  },
  getAssigned: async (req: any, res: Response): Promise<void> => {
    let claims = await Claim.find({
      validatorID: req.user.id,
      status: { $in: ["Awaiting Validator"] },
    });
    const result: any[] = [];
    for (var i = 0; i < claims.length; i++) {
      const customer: any = await User.findById(claims[i].clientID);
      result.push({
        ...claims[i]._doc,
        client_name: customer.fullname,
        client_address: customer.address.line1,
      });
    }
    res.json(result);
  },
  getAssessed: async (req: any, res: Response): Promise<void> => {
    let claims = await Claim.find({
      validatorID: req.user.id,
      status: { $in: ["Approved", "Declined"] },
    });
    const result: any[] = [];
    for (var i = 0; i < claims.length; i++) {
      const customer: any = await User.findById(claims[i].clientID);
      result.push({
        ...claims[i]._doc,
        client_name: customer.fullname,
        client_address: customer.address.line1,
      });
    }
    res.json(result);
  },
  add: async (req: any, res: Response): Promise<void> => {
    const { weather, date, clientID, status } = req.body;
    let claim = new Claim({
      weather,
      clientID,
    });
    claim.save();
    res.json({ result: "success" });
  },
  feedback: async (req: any, res: Response): Promise<void> => {
    const { id, feedback } = req.body;
    let claim: any = await Claim.findById(id);
    if (feedback) {
      const weatherEvent = await Weather.findById(claim.weatherEventID);
      const rand = Math.floor(Math.random() * 1000) % 2;
      if (rand) claim.status = "Approved";
      else {
        const user = await User.findById(req.user.id);
        const validator: any = await User.findOne({
          role: "validator",
          city: user?.address.city,
        });
        claim.status = "Awaiting Validator";
        claim.validatorID = validator?._id;
      }
    } else claim.status = "Declined";
    claim.save();
    res.json({ result: "success" });
  },
  validate: async (req: any, res: Response): Promise<void> => {
    res.json({ result: "success" });
  },
};
