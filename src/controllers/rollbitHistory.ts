import { DataApi } from "../api/data"

function findAll() {
  const data = new DataApi();
  return data.findRollbitHistories();
}

export = {
  findAll,
}