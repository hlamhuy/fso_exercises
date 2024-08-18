import axios from "axios";
import { DiaryEntry, NewDiaryEntry } from "../types";
const baseUrl = "http://localhost:3000/api/diaries";

const getAllEntries = async () => {
  const { data } = await axios.get<DiaryEntry[]>(baseUrl);
  return data;
};

const addEntry = async (object: NewDiaryEntry) => {
  const { data } = await axios.post<DiaryEntry>(baseUrl, object);
  return data;
};

export default { getAllEntries, addEntry };
