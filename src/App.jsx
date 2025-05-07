import React, { useState, useEffect, useCallback } from 'react';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await fetch(API_ENDPOINT + searchTerm);
      if (!response.ok) {
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`
        );
      }
      const data = await response.json();
      setResults(data.hits);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    handleSearchSubmit();
  }, []); // Fetch initial data on component mount

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <Search
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      {isError && <p>Something went wrong ...</p>}

      {isLoading ? (
        <p>Loading ...</p>
      ) : (
        results && <List list={results} />
      )}
    </div>
  );
};

const Search = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
  <div>
    <label htmlFor="search">Search: </label>
    <input
      id="search"
      type="text"
      value={searchTerm}
      onChange={onSearchInput}
    />
    <button type="button" onClick={onSearchSubmit}>
      Search
    </button>
  </div>
);

const List = ({ list }) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} />
    ))}
  </ul>
);

const Item = ({ item }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </li>
);

export default App;