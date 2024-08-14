import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ALL_BOOKS_BY_GENRE } from "../queries";

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState("");
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const result = useQuery(selectedGenre ? ALL_BOOKS_BY_GENRE : ALL_BOOKS, {
    variables: selectedGenre ? { genre: selectedGenre } : {},
  });

  useEffect(() => {
    console.log("Result of ALL_BOOKS query:", result);
    if (result.data) {
      const allBooks = result.data.allBooks;
      console.log("Result of allBooks var:", allBooks);
      setBooks(allBooks);
      if (!selectedGenre) {
        let genres = [];
        allBooks.forEach((element) => {
          element.genres.forEach((g) => {
            if (genres.indexOf(g) === -1) {
              genres.push(g);
            }
          });
        });
        setGenres(genres);
      }
    }
  }, [result.data, selectedGenre]);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>books</h2>
      <div>
        <label>
          Filter by genre:
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">All genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p>
        in genre <b>{selectedGenre ? selectedGenre : "all genres"}</b>
      </p>
      {console.log("Books to render:", books)}
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
