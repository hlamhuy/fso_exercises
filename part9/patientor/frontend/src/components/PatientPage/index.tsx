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
    </div>
  );
};

export default PatientPage;
