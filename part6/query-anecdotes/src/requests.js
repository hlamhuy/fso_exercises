import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

export const getAnecdotes = () => axios.get(baseUrl).then((res) => res.data);

export const addAnecdote = (newAnecdote) =>
  axios.post(baseUrl, newAnecdote).then((res) => res.data);

export const updateAnecdote = (votedAnecdote) =>
  axios
    .put(`${baseUrl}/${votedAnecdote.id}`, votedAnecdote)
    .then((res) => res.data);
