import patientsData from "../data/patients";
import {
  Patient,
  NewPatientType,
  NonSensitivePatientEntry,
  EntryWithoutId,
  Entry,
} from "../types";
import { v1 as uuid } from "uuid";

const getAllPatients = (): Patient[] => {
  return patientsData;
};

const getNonSenData = (): NonSensitivePatientEntry[] => {
  return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const findById = (id: string): Patient | undefined => {
  const patient = patientsData.find((d) => d.id === id);
  return patient;
};

const addPatient = (newPatient: NewPatientType): Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...newPatient,
  };
  patientsData.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (patient: Patient, entry: EntryWithoutId): Entry => {
  const newEntry = {
    id: uuid(),
    ...entry,
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getAllPatients,
  getNonSenData,
  addPatient,
  findById,
  addEntry,
};
