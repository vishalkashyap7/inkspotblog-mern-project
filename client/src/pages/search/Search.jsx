import React, { useEffect, useState } from "react";
import axios from "axios";
import "./search.css";
import { Link } from "react-router-dom";

function MyComponent({ content }) {
  return (
    <div className="paraSearch" dangerouslySetInnerHTML={{ __html: content }} />
  );
}


function SearchResults({ query, results }) {
  // console.log(query, results);
  if (!query) {
    return <div className="resultsOfSearch1">Use this search bar</div>;
  } else if (query && results.length === 0) {
    return (
      <div className="resultsOfSearch1">No results found for "{query}"</div>
    );
  } else if (query && results.length) {
    return <div className="resultsOfSearch1">Here are the top results</div>;
  }
}

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const handleSearch = async (query) => {
      const response = await axios.get(
        `http://localhost:5000/api/posts/search?query=${query}`
      );
      // console.log("response is ", response.data);
      setResults(response.data);
    };
    handleSearch(query);
  }, [query]);
  function handleSearchForm(e) {
    e.preventDefault();
  }

  return (
    <div className="searchDiv">
      <form onSubmit={handleSearchForm}>
        <div className="searchBar">
          <div className="searchButton">
            <i className="fas fa-search searchIcon topSearchIcon"></i>
          </div>
          <input
            type="text"
            placeholder="Search here...."
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </div>
      </form>
      <div className="searchResult">
        <SearchResults query={query} results={results} />
        {query !== "" &&
          results.map((result, i) => (
            <Link to={`/post/${result._id}`} className="link" key={i}>
              <div className="searchBoxResult">
                <h2>{result.title}</h2>
                
                <MyComponent content={result.desc} />
                {/* <p className="paraSearch">{}</p> */}
                <p className="dateSearch">
                  {new Date(result.updatedAt).toDateString()}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Search;
