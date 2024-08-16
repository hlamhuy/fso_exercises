import diagnosesData from "../data/diagnoses";
import { DiagnosisType } from "../types";

const getAllDiagnoses = (): DiagnosisType[] => {
  return diagnosesData;
};

export default {
  getAllDiagnoses,
};
