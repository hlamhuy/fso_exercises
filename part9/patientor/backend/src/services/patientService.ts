import patientsData from "../data/patients";
import {
  PatientType,
  NewPatientType,
  NonSensitivePatientEntry,
} from "../types";
import { v1 as uuid } from "uuid";


const getAllPatients = (): PatientType[] => {
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

const addPatient = ( newPatient: NewPatientType): PatientType => {
  const newPatientEntry = {
    id: uuid(),
    ...newPatient
  }
  patientsData.push(newPatientEntry)
  return newPatientEntry
};

export default {
  getAllPatients,
  getNonSenData,
  addPatient
};
