import { Patient, Diagnosis, Entry } from "../../types";

interface Props {
  patient: Patient | null | undefined;
  diagnoses: Diagnosis[];
}
const PatientPage = ({ patient, diagnoses }: Props) => {
  const style = {
    border: "solid",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
    display: "block",
  };
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const EntryDetails = ({ entry }: { entry: Entry }) => {
    switch (entry.type) {
      case "HealthCheck":
        return <div>health rating: {entry.healthCheckRating}</div>;
      case "Hospital":
        return (
          <div>
            <p>
              discharge date: {entry.discharge.date} ({entry.discharge.criteria}
              )
            </p>
          </div>
        );
      case "OccupationalHealthcare":
        return (
          <div>
            {entry.sickLeave ? (
              <p>
                sick leave: from <b>{entry.sickLeave.startDate}</b> to{" "}
                <b>{entry.sickLeave.endDate}</b>
              </p>
            ) : null}
          </div>
        );
      default:
        return assertNever(entry);
    }
  };
  return (
    <div>
      <h2>{patient?.name}</h2>
      <p>gender: {patient?.gender}</p>
      <p>ssn: {patient?.ssn}</p>
      <p>occupation: {patient?.occupation}</p>
      <h3>entries</h3>
      <p>
        {patient?.entries.map((entry) => (
          <div key={entry.id} style={style}>
            <p>
              <b>{entry.date}</b>
            </p>
            <p>
              type: {entry.type}
              {entry.type === "OccupationalHealthcare" ? (
                entry.employerName ? (
                  <p>company: {entry.employerName}</p>
                ) : null
              ) : null}
            </p>
            <p>
              <i>{entry.description}</i>
            </p>
            <ul>
              {entry.diagnosisCodes?.map((d) => {
                const diagnosis = diagnoses.find((f) => f.code === d)?.name;
                return (
                  <li key={d}>
                    <b>{d}</b> {diagnosis ? diagnosis : null}
                  </li>
                );
              })}
            </ul>
            <EntryDetails entry={entry} />
            <p>diagnosed by {entry.specialist}</p>
          </div>
        ))}
      </p>
    </div>
  );
};

export default PatientPage;
