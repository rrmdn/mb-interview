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

const Row = ({ row, term }) => {
  const highlightedName = React.useMemo(() => {
    let name = row.name;
    for (const splitTerm of term.split(" ")) {
      const startPosition = name.toLowerCase().indexOf(splitTerm.toLowerCase());
      const endPosition = startPosition + splitTerm.length;
      const toHighlight = name.slice(startPosition, endPosition);
      name = name.replace(toHighlight, "<strong>" + toHighlight + "</strong>");
    }

    return name;
  }, [row.name, term]);
  return (
    <tr>
      <td dangerouslySetInnerHTML={{ __html: highlightedName }}></td>
      <td>{row.phone}</td>
      <td>{row.address}</td>
    </tr>
  );
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

    Promise.all(
      debouncedTerm.split(" ").map(async (splitTerm, i) => {
        await new Promise((resolve) => {
          setTimeout(resolve, i * 200);
        });
        return getData(splitTerm);
      })
    ).then((matches) => {
      const results = matches.reduce((prev, cur) => {
        if (prev.length === 0) return cur;
        return _.intersectionBy(prev, cur, (row) => row.name);
      }, []);
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
            return <Row key={row.phone} row={row} term={state.term} />;
          })}
        </table>
      </div>
    </div>
  );
}
