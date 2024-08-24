export function calculateBmi(ht: number, wt: number): string {
  const htInMs = ht / 100;
  const bmi = wt / (htInMs * htInMs);

  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi >= 18.5 && bmi < 25) {
    return "Normal range";
  } else if (bmi >= 25 && bmi < 30) {
    return "Overweight";
  } else {
    return "Obesity";
  }
}

if (require.main === module) {
  const height = Number(process.argv[2]);
  const weight = Number(process.argv[3]);

  if (!isNaN(height) && !isNaN(weight)) {
    console.log(calculateBmi(height, weight));
  } else {
    console.log("Please enter valid height and weight.");
  }
}
