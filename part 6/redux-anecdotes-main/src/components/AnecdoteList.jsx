import { useSelector, useDispatch } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { showNotification } from "../reducers/notificationReducer";
const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) =>
    anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  );
  const dispatch = useDispatch();

  const vote = (id) => {
    dispatch(voteAnecdote(id));
    const anecdote = anecdotes.find((a) => a.id === id);
    dispatch(showNotification(`You voted '${anecdote.content}'`, 5));
  };

  return (
    <div>
      {[...anecdotes]
        .slice()
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnecdoteList;
