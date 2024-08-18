export type DiagnosisType = {
  code: string;
  name: string;
  latin?: string;
};

export interface Entry {}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: string;
  occupation: string;
  entries: Entry[];
}

export type NonSensitivePatientEntry = Omit<Patient, "ssn" | "entries">;

export type NewPatientType = Omit<Patient, "id">;

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}
