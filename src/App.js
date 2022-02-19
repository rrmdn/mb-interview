import React from "react";
import _ from "lodash";
import MapExpire from "map-expire/MapExpire";

const getData = async (searchTerm) => {
  const response = await fetch(`/search?term=${searchTerm}`);
  if (!response.ok) {
    throw new Error(`${response.statusText}`);
  } else {
    return await response.json();
  }
};

const useSearch = (term) => {
  const [debouncedTerm, setDebouncedTerm] = React.useState(term);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedTerm(term);
    }, 300);
    return () => clearTimeout(timeout);
  }, [term]);
  const [results, setResults] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const cacheRef = React.useRef(
    // https://www.npmjs.com/package/map-expire
    new MapExpire([], { capacity: 3, duration: 5000 })
  );
  React.useEffect(() => {
    let cached = cacheRef.current.get(debouncedTerm);
    if (cached) {
      return setResults(cached);
    }
    const timeout = setTimeout(() => {
      setIsLoading(true);
    }, 500);

    getData(debouncedTerm).then((results) => {
      cacheRef.current.set(debouncedTerm, results);
      setResults(results);
      clearTimeout(timeout);
      setIsLoading(false);
    });

    return () => !!timeout && clearTimeout(timeout);
  }, [debouncedTerm]);
  return { results, isLoading };
};

export default function App() {
  const [state, setState] = React.useState({ term: "" });
  const search = useSearch(state.term);
  const handleSearch = React.useCallback((e) => {
    const term = e.currentTarget.value;
    setState((state) => ({ ...state, term }));
  }, []);

  return (
    <div style={{ width: "500px" }}>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, paddingRight: 20 }}>
          <input
            style={{ width: "100%" }}
            onChange={handleSearch}
            placeholder="search.."
          />
        </div>
      </div>
      <div
        className={
          search.isLoading &&
          "animate__animated animate__flash animate__infinite"
        }
      >
        <table position="absolute" inset="0">
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
          {search.results.map((row) => {
            return (
              <tr>
                <td>{row.name}</td>
                <td>{row.phone}</td>
                <td>{row.address}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
}
