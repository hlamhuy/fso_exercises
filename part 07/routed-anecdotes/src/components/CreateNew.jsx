import React from "react";
import { useNavigate } from "react-router-dom";
import { useField } from "../hooks"; // Import the useField hook

const CreateNew = ({ addNew, setNotification }) => {
  const content = useField("text");
  const author = useField("text");
  const info = useField("text");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });
    setNotification(`A new anecdote "${content.value}" created!`);
    setTimeout(() => {
      setNotification("");
    }, 5000);
    navigate("/anecdotes");

    // Reset the fields after submission
    content.reset();
    author.reset();
    info.reset();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} reset={undefined} />
        </div>
        <div>
          author
          <input {...author} reset={undefined} />
        </div>
        <div>
          url for more info
          <input {...info} reset={undefined} />
        </div>
        <button>create</button>
      </form>
    </div>
  );
};

export default CreateNew;
