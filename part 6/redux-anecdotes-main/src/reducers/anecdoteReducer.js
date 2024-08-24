import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    updateAnecdote(state, action) {
      const updatedAnecdote = action.payload;
      return state.map((anecdote) =>
        anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
      );
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { appendAnecdote, setAnecdotes, updateAnecdote } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const addAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const voteAnecdote = (id) => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    const anecdoteToVote = anecdotes.find((a) => a.id === id);
    if (anecdoteToVote) {
      const updatedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1,
      };
      const response = await anecdoteService.updateVote(id, updatedAnecdote);
      dispatch(updateAnecdote(response));
    }
  };
};
export default anecdoteSlice.reducer;
