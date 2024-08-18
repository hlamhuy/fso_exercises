import express from "express";
import patientService from "../services/patientService";
import toNewPatientEntry from "../utils";

const patientRouter = express.Router();

patientRouter.get("/", (_req, res) => {
  res.send(patientService.getNonSenData());
});

patientRouter.post("/", (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const addedEntry = patientService.addPatient(newPatientEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});
export default patientRouter;
