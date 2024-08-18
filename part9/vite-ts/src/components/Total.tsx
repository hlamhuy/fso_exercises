import { TotalProps } from "../types";

const Total = (props: TotalProps) => {
  return <p>Number of exercises {props.totalExercise}</p>;
};

export default Total;
