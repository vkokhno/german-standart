const URL = "https://api.themoviedb.org/3";
const API_KEY = "80efa8d0a756d5f90ee1b1bf0d599ad9";
const LANGUAGE = "en-US";

export const URLs = {
  movie: `${URL}/discover/movie?api_key=${API_KEY}&language=${LANGUAGE}`,
  genre: `${URL}/genre/movie/list?api_key=${API_KEY}&language=${LANGUAGE}`,
};
