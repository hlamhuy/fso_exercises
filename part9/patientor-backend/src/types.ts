export type DiagnosisType = {
  code: string;
  name: string;
  latin?: string;
};

export type PatientType = {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: string;
  occupation: string;
};

export type NonSensitivePatientEntry = Omit<PatientType, 'ssn'>;