import express from "express";
import diagnoseService from "../services/diagnoseService";

const diagnosesRouter = express.Router();

diagnosesRouter.get("/", (_req, res) => {
  res.send(diagnoseService.getAllDiagnoses());
});

export default diagnosesRouter;
