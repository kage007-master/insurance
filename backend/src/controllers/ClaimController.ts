import Claim from "../models/Claim";
import { Response } from "express";
import User from "../models/User";
import interactor from "../services/interactor";
import Notification from "../models/Notification";
import Coverage from "../models/Coverage";
import moment from "moment";
import {
  APPROVED_BY_CUSTOMER,
  APPROVED_BY_VALIDATOR,
  AWAITING_VALIDATOR,
  DECLINED_BY_CUSTOMER,
  DECLINED_BY_VALIDATOR,
  PENDING,
} from "../config/const";

export default {
  getAll: async (req: any, res: Response): Promise<void> => {
    let claims = await Claim.find({}).sort({ date: -1 });
    const result: any[] = [];
    for (var i = 0; i < claims.length; i++) {
      const customer: any = await User.findById(claims[i].clientID);
      const validator: any = await User.findById(claims[i].validatorID);
      result.push({
        ...claims[i]._doc,
        customer_name: customer.fullname,
        validator_name: validator?.fullname,
        validator_email: validator?.email,
      });
    }
    res.json(result);
  },
  getActive: async (req: any, res: Response): Promise<void> => {
    let claims = await Claim.find({
      clientID: req.user.id,
      status: PENDING,
    }).sort({ date: -1 });
    res.json(claims);
  },
  getPast: async (req: any, res: Response): Promise<void> => {
    let claims = await Claim.find({
      clientID: req.user.id,
      status: { $nin: [PENDING] },
    }).sort({ date: -1 });
    res.json(claims);
  },
  getAssigned: async (req: any, res: Response): Promise<void> => {
    let claims = await Claim.find({
      validatorID: req.user.id,
      status: { $in: [AWAITING_VALIDATOR] },
    }).sort({ date: -1 });
    const result: any[] = [];
    for (var i = 0; i < claims.length; i++) {
      const customer: any = await User.findById(claims[i].clientID);
      result.push({
        ...claims[i]._doc,
        client_name: customer.fullname,
        client_address: customer.address.line1,
        city: customer.address.city,
      });
    }
    res.json(result);
  },
  getAssessed: async (req: any, res: Response): Promise<void> => {
    let claims = await Claim.find({
      validatorID: req.user.id,
      status: { $in: [APPROVED_BY_VALIDATOR, DECLINED_BY_VALIDATOR] },
    }).sort({ date: -1 });
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
  add: async (req: any, res: Response): Promise<void> => {},
  feedback: async (req: any, res: Response): Promise<void> => {
    const { id, feedback } = req.body;
    let claim: any = await Claim.findById(id);
    claim.status = feedback ? APPROVED_BY_CUSTOMER : DECLINED_BY_CUSTOMER;
    if (feedback) await interactor.ConfirmDamage(claim.weatherEventID);
    claim.save();
    res.json({ result: claim.status, id });
  },
  validate: async (req: any, res: Response): Promise<void> => {
    const { id, confirm, detail, file } = req.body;
    let claim = await Claim.findById(id);
    if (claim) {
      claim.status = confirm ? APPROVED_BY_VALIDATOR : DECLINED_BY_VALIDATOR;
      claim.detail = detail;
      claim.validateTime = new Date();
      claim.file = file;
      await claim.save();
      const coverage = await Coverage.findOne({ weather: claim.weather });
      if (confirm) {
        await interactor.TransferAsset(
          claim.clientID,
          -coverage?.reimbursement,
          new Date().toISOString()
        );
      }
      const notification = new Notification({
        clientID: claim.clientID,
        title: `Claim ${claim.status}`,
        content: `Claim is ${String(
          claim.status
        ).toLowerCase()} by validator. ClaimID: ${claim._id}`,
        date: new Date(),
      });
      notification.save();
      // socket.broadcast();
    }
    res.json({ result: claim?.status, id });
  },
  schedule: async (req: any, res: Response): Promise<void> => {
    const { id, date, time } = req.body;
    let claim = await Claim.findById(id);
    if (claim) {
      const schedule = new Date(date);
      const _time = new Date(time);
      schedule.setHours(_time.getHours());
      schedule.setMinutes(_time.getMinutes());
      claim.schedule = schedule;
      await claim.save();
      const notification = new Notification({
        clientID: claim.clientID,
        title: `Schedule an Appointement`,
        content: `Validator scheduled to visit damage on ${moment(
          schedule
        ).format("llll")}. ClaimID: ${claim._id}`,
        extra: schedule,
        date: new Date(),
      });
      await notification.save();
    }
    res.json({ result: claim?.status, id });
  },
};
