import express from "express";
import patientService from "../services/patientService";
import toNewPatientEntry from "../utils/patients";
import toNewEntry from "../utils/entries";

const patientRouter = express.Router();

patientRouter.get("/", (_req, res) => {
  res.send(patientService.getAllPatients());
});

patientRouter.get("/:id", (req, res) => {
  res.send(patientService.findById(req.params.id));
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

patientRouter.post("/:id/entries", (req, res) => {
  try {
    const patient = patientService.findById(req.params.id);
    const newEntry = toNewEntry(req.body);
    const addedEntry = patientService.addEntry(patient!, newEntry);
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
