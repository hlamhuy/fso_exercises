import {
  HealthCheckRating,
  EntryWithoutId,
  DiagnosisType,
  sickLeave,
  discharge,
  NewBaseEntry,
} from "../types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isNumber = (text: unknown): text is number => {
  return typeof text === "number" || text instanceof Number;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isHealthRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthRating = (healthRating: unknown): HealthCheckRating => {
  if (
    !healthRating ||
    !isNumber(healthRating) ||
    !isHealthRating(healthRating)
  ) {
    throw new Error("Incorrect or missing health rating: " + healthRating);
  }
  return healthRating;
};

const parseEmployerName = (employerName: unknown): string => {
  if (!employerName || !isString(employerName)) {
    throw new Error("Incorrect ot missing description");
  }
  return employerName;
};

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error("Incorrect ot missing description");
  }
  return description;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error("Incorrect or missing specialist");
  }
  return specialist;
};
const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

const parseCriteria = (criteria: unknown): string => {
  if (!criteria || !isString(criteria)) {
    throw new Error("Incorrect or missing criteria");
  }
  return criteria;
};
const parseDischarge = (object: unknown): discharge => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }
  if ("date" in object && "criteria" in object) {
    const discharge: discharge = {
      date: parseDate(object.date),
      criteria: parseCriteria(object.criteria),
    };
    return discharge;
  }
  throw new Error("Incorrect data: discharge is date or criteria");
};

const parseSickLeave = (object: unknown): sickLeave => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if ("startDate" in object && "endDate" in object) {
    const sickLeave: sickLeave = {
      startDate: parseDate(object.startDate),
      endDate: parseDate(object.endDate),
    };
    return sickLeave;
  }
  throw new Error("Incorrect data: discharge is missing dates");
};

const parseDiagnosisCodes = (object: unknown): Array<DiagnosisType["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<DiagnosisType["code"]>;
  }

  return object.diagnosisCodes as Array<DiagnosisType["code"]>;
};

const toNewEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }
  if ("date" in object && "specialist" in object && "description" in object) {
    const newEntry: NewBaseEntry =
      "diagnosisCodes" in object
        ? {
            date: parseDate(object.date),
            specialist: parseSpecialist(object.specialist),
            description: parseDescription(object.description),
            diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
          }
        : {
            date: parseDate(object.date),
            specialist: parseSpecialist(object.specialist),
            description: parseDescription(object.description),
          };
    if ("type" in object) {
      switch (object.type) {
        case "HealthCheck":
          if ("healthCheckRating" in object) {
            const healthCheckEntry: EntryWithoutId = {
              ...newEntry,
              type: "HealthCheck",
              healthCheckRating: parseHealthRating(object.healthCheckRating),
            };
            return healthCheckEntry;
          }
          throw new Error("Incorrect data: health check rating missing");
        case "OccupationalHealthcare":
          if ("employerName" in object) {
            const occuHealthEntry: EntryWithoutId =
              "sickLeave" in object
                ? {
                    ...newEntry,
                    type: "OccupationalHealthcare",
                    employerName: parseEmployerName(object.employerName),
                    sickLeave: parseSickLeave(object.sickLeave),
                  }
                : {
                    ...newEntry,
                    type: "OccupationalHealthcare",
                    employerName: parseEmployerName(object.employerName),
                  };
            return occuHealthEntry;
          }
          throw new Error("Incorrect data: employer name missing");
        case "Hospital":
          if ("discharge" in object) {
            const hospitalEntry: EntryWithoutId = {
              ...newEntry,
              type: "Hospital",
              discharge: parseDischarge(object.discharge),
            };
            return hospitalEntry;
          }
          throw new Error("Incorrect data: discharge missing");
      }
    }
  }
  throw new Error("Incorrect data: some fields are missing");
};

export default toNewEntry;
