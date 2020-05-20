import React, { useState, useEffect, useMemo } from "react";
import { stringify } from "qs";
import { Table } from "antd";

import { URLs } from "../../constants";
import { parseParams } from "../../common";

const List = ({ genres }) => {
  const [movies, setMovies] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, defaultPageSize: 20 });
  const [isLoading, setLoading] = useState(false);

  // table columns configuration
  const columns = useMemo(
    () => [
      {
        title: "Title",
        dataIndex: "original_title",
        sorter: true,
      },
      {
        title: "Genre",
        dataIndex: "genre_ids",
        filters: genres.map(({ id, name }) => ({ value: id, text: name })),
        filterMultiple: false,
        render: (ids) => ids.map((id) => genres[genres.findIndex((genre) => genre.id === id)]?.name).join(", "),
        width: "20%",
      },
      {
        title: "Year",
        dataIndex: "release_date",
        sorter: true,
        width: "10%",
      },
      {
        title: "Vote",
        dataIndex: "vote_average",
        filters: Array(10)
          .fill(0)
          .map((value, index) => ({ value: index, text: index })),
        filterMultiple: false,
        sorter: true,
        width: "10%",
      },
    ],
    [genres]
  );

  // fetch movies
  const getMovies = (params = {}) => {
    setLoading(true);
    // api always returns 20 pageSize, I need to do some requests
    const queriesNumber = params.pagination?.pageSize / 20 || 1;
    const queries = Array(queriesNumber)
      .fill(0)
      .map((value, index) =>
        fetch(
          `${URLs.movie}&${stringify({
            ...parseParams({
              ...params,
              pagination: { current: params.pagination?.current * queriesNumber - index },
            }),
          })}`
        )
      );
    // await all responses
    Promise.all(queries)
      .then((reses) => Promise.all(reses.map((res) => res.json())))
      .then((reses) =>
        // concat them
        reses.reduce(
          (obj, res) => ({
            page: res.page,
            results: obj.results.concat(res.results),
            total_results: res.total_results,
          }),
          { results: [] }
        )
      )
      .then(({ page, results, total_results }) => {
        setMovies(results);
        setPagination({ current: Math.ceil(page / queriesNumber), total: total_results });
        setLoading(false);
      });
  };

  // do request when did mount
  useEffect(() => {
    getMovies();
  }, []);

  return (
    <Table
      dataSource={movies}
      columns={columns}
      rowKey={({ id }) => id}
      pagination={{ ...pagination, pageSizeOptions: ["20", "60", "100"] }}
      loading={isLoading}
      onChange={(pagination, filters, sorter) => getMovies({ pagination, filters, sorter })}
    />
  );
};

export default List;
