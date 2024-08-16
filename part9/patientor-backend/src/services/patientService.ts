import patientsData from "../data/patients";
import { PatientType, NonSensitivePatientEntry } from "../types";

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

export default {
  getAllPatients,
  getNonSenData,
};
