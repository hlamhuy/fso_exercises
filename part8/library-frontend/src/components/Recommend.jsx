import React, { useState, useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { ME, ALL_BOOKS_BY_GENRE } from "../queries";

const Recommend = ({ show }) => {
  const user = useQuery(ME);
  const [getFavoriteBooks, result] = useLazyQuery(ALL_BOOKS_BY_GENRE);
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  useEffect(() => {
    if (result.data) {
      setFavoriteBooks(result.data.allBooks);
    }
  }, [setFavoriteBooks, result]);

  useEffect(() => {
    if (user.data) {
      getFavoriteBooks({ variables: { genre: user.data.me.favoriteGenre } });
    }
  }, [getFavoriteBooks, user]);

  if (!show) {
    return null;
  }

  return (
    <div>
      <p>
        books in your favorite genre <b>{user.data.me.favoriteGenre}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {favoriteBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
