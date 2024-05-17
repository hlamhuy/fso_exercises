import { useState } from "react";

const Header = ({ header }) => <h1>{header}</h1>;
const Button = ({ handleClick, text }) => (
  <div>
    <button onClick={handleClick}>{text}</button>
  </div>
);
const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0));
  const highestVoteIndex = points.indexOf(Math.max(...points));

  const nextAnecdote = () => {
    const rand = Math.floor(Math.random() * anecdotes.length);
    setSelected(rand);
  };

  const vote = () => {
    const copy = [...points];
    copy[selected] += 1;
    setPoints(copy);
  };

  return (
    <>
      <div>
        <Header header="Anecdote of the day" />
        <div>{anecdotes[selected]}</div>
        <div>has {points[selected]} votes</div>
        <Button handleClick={() => vote()} text="vote" />
        <Button handleClick={() => nextAnecdote()} text="next anecdote" />
      </div>
      <div>
        <Header header="Anecdote with most votes" />
        <div>{anecdotes[highestVoteIndex]}</div>
        <div>has {points[highestVoteIndex]} votes</div>
      </div>
    </>
  );
};

export default App;
