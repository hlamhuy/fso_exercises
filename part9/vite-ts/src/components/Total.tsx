interface TotalProps {
  totalExercise: number;
}

const Total = (props: TotalProps) => {
  return <p>Number of exercises {props.totalExercise}</p>;
};

export default Total;
