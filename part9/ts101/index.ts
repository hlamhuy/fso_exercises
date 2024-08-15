import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises, Result } from "./exerciseCalculator";
const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!height || !weight || isNaN(height) || isNaN(weight)) {
    res.status(400);
    res.send({ error: "Malformatted parameters" });
  }

  const bmi = calculateBmi(height, weight);

  res.send({
    weight,
    height,
    bmi,
  });
});

app.post("/exercises", (req, res) => {
  const daily_exercises = req.body.daily_exercises;
  const target = req.body.target;

  if (!daily_exercises || !target) {
    return res.status(400).send({ error: "parameters missing" });
  }

  if (!Array.isArray(daily_exercises) || typeof target !== "number") {
    return res.status(400).send({ error: "malformatted parameters" });
  }

  const dailyHours = daily_exercises.map(Number);

  if (dailyHours.some(isNaN)) {
    return res.status(400).send({ error: "malformatted parameters" });
  }

  const result: Result = calculateExercises(dailyHours, target);
  return res.send(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
