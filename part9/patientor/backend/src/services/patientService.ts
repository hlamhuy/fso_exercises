import patientsData from "../data/patients";
import { Patient, NewPatientType, NonSensitivePatientEntry } from "../types";
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

export default {
  getAllPatients,
  getNonSenData,
  addPatient,
  findById,
};
