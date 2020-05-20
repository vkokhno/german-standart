import React, { useState, useEffect } from "react";

import List from "../list";

import { URLs } from "../../constants";

import "./styles.css";

const App = () => {
  const [genres, setGenres] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(URLs.genre)
      .then((res) => res.json())
      .then(({ genres }) => {
        setGenres(genres);
        setLoading(false);
      });
  }, []);

  return <div className="app">{!isLoading ? <List genres={genres} /> : null}</div>;
};

export default App;
