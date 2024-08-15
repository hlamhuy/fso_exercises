interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

function calculateExercises(dailyHours: number[], target: number): Result {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((day) => day > 0).length;
  const totalHours = dailyHours.reduce((sum, hours) => sum + hours, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = "mission success!";
  } else if (average >= target * 0.8) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 1;
    ratingDescription = "you need to go to the gym now!";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
}

const target = Number(process.argv[2]);
const dailyHours = process.argv.slice(3).map(Number);

if (!isNaN(target) && dailyHours.every((hour) => !isNaN(hour))) {
  const result = calculateExercises(dailyHours, target);
  console.log(result);
} else {
  console.log("Please enter valid target and exercise hours.");
}
