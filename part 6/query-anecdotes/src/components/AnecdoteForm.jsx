import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAnecdote } from "../requests";
import { useContext } from "react";
import { NotificationContext } from "../NotificationContext";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const [notification, notiDispatch] = useContext(NotificationContext);

  const newAnecdoteMutation = useMutation({
    mutationFn: addAnecdote,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
      notiDispatch({
        type: "NOTIFY",
        payload: `Anecdote '${data.content}' created`,
      });
      setTimeout(() => {
        notiDispatch({ type: "CLEAR" });
      }, 5000);
    },
    onError: (error) => {
      notiDispatch({ type: "NOTIFY", payload: `Error: ${error.message}` });
      setTimeout(() => {
        notiDispatch({ type: "CLEAR" });
      }, 5000);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    if (content.length < 5) {
      notiDispatch({
        type: "NOTIFY",
        payload: "Anecdote content must be at least 5 characters long",
      });
      setTimeout(() => {
        notiDispatch({ type: "CLEAR" });
      }, 5000);
      return;
    }
    newAnecdoteMutation.mutate({ content, votes: 0 });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
