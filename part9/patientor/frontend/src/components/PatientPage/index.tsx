import { Patient } from "../../types";

interface Props {
  patient: Patient | null | undefined;
}
const PatientPage = ({ patient }: Props) => {
  return (
    <div>
      <h2>{patient?.name}</h2>
      <p>gender: {patient?.gender}</p>
      <p>ssn: {patient?.ssn}</p>
      <p>occupation: {patient?.occupation}</p>
      <h3>entries</h3>
      <p>
        {patient?.entries.map((entry) => (
          <div key={entry.id}>
            <p>
              {entry.date}: {entry.description}
            </p>
            <ul>
              {entry.diagnosisCodes?.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        ))}
      </p>
    </div>
  );
};

export default PatientPage;
