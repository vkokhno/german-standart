// parse Table params into correct for API
export const parseParams = ({ pagination, filters, sorter }) => {
  const params = {};

  if (filters?.genre_ids) {
    params["with_genres"] = filters.genre_ids.join();
  }

  if (filters?.vote_average) {
    params["vote_average.gte"] = filters.vote_average.join();
    params["vote_average.lte"] = Number(filters.vote_average.join()) + 1;
  }

  if (sorter?.field) {
    const order = sorter?.order === "descend" ? "desc" : "asc";
    params["sort_by"] = `${sorter?.field}.${order}`;
  }

  params["page"] = pagination?.current || 1;

  return params;
};
