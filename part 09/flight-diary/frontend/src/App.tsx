import { useState, useEffect } from "react";
import { DiaryEntry, Weather, Visibility } from "./types";
import diaryService from "./services/diaryService";

const App = () => {
  const [diaryEntry, setDiaryEntry] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    diaryService.getAllEntries().then((data) => {
      setDiaryEntry(data);
    });
  }, []);

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    diaryService
      .addEntry({ date, visibility, weather, comment })
      .then((data) => {
        setDiaryEntry(diaryEntry.concat(data));
        setComment("");
      })
      .catch((err) => {
        const errorMessage = err.response.data.message;
        setError(errorMessage);
      });
  };
  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h1>Add new entry</h1>
      <form onSubmit={diaryCreation}>
        <div>
          date
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div>
          visibility
          {Object.values(Visibility).map((v) => (
            <label key={v}>
              <input
                type="radio"
                name="visibility"
                value={v}
                checked={visibility === v}
                onChange={() => setVisibility(v)}
              />
              {v}
            </label>
          ))}
        </div>
        <div>
          weather
          {Object.values(Weather).map((w) => (
            <label key={w}>
              <input
                type="radio"
                name="weather"
                value={w}
                checked={weather === w}
                onChange={() => setWeather(w)}
              />
              {w}
            </label>
          ))}
        </div>
        <div>
          comment
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>
      <h1>Diary entries</h1>
      {diaryEntry.map((diary) => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <p>visibility: {diary.visibility}</p>
          <p>weather: {diary.weather}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
