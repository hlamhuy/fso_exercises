import { useState } from "react";

const Header = ({ header }) => (
  <div>
    <h1>{header}</h1>
  </div>
);

const Button = ({ handleClick, text }) => (
  <div>
    <button onClick={handleClick}>{text}</button>
  </div>
);

const Statistics = ({ good, neutral, bad, total, average, positive }) => {
  if (total === 0) {
    return (
      <div>
        <p>no feedback given</p>
      </div>
    );
  } else {
    return (
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="total" value={total} />
          <StatisticLine text="average" value={average.toFixed(1)} />
          <StatisticLine text="positive" value={positive.toFixed(1)} />
        </tbody>
      </table>
    );
  }
};

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{text === "positive" ? `${value}%` : value}</td>
  </tr>
);

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  // handle feedback buttons
  const handleFeedback = (type) => {
    const newValues = {
      good: type === "good" ? good + 1 : good,
      neutral: type === "neutral" ? neutral + 1 : neutral,
      bad: type === "bad" ? bad + 1 : bad,
    };
    const newTotal = newValues.good + newValues.neutral + newValues.bad;
    setGood(newValues.good);
    setNeutral(newValues.neutral);
    setBad(newValues.bad);
    setTotal(newTotal);
    setAverage((newValues.good - newValues.bad) / newTotal);
    setPositive((newValues.good / newTotal) * 100);
  };

  return (
    <>
      <div>
        <Header header="give feedback" />
        <div>
          <Button handleClick={() => handleFeedback("good")} text="good" />
          <Button
            handleClick={() => handleFeedback("neutral")}
            text="neutral"
          />
          <Button handleClick={() => handleFeedback("bad")} text="bad" />
        </div>
      </div>

      <div>
        <Header header="statistics" />
        <Statistics
          good={good}
          neutral={neutral}
          bad={bad}
          total={total}
          average={average}
          positive={positive}
        />
      </div>
    </>
  );
};

export default App;
