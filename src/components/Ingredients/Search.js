import React, { useState, useEffect, useRef } from "react";
import useHttp from "../../hooks/http";

import Card from "../UI/Card";
import ErrorModal from "../UI/ErrorModal";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();
  const { isLoading, data, error, sendRequest, clear } = useHttp();

  // Gets executed whenever a component has finished rendering
  // Second arguement:
  // 1. If empty array it runs only once after the component is first rendered
  // 2. If any variable(s) then first function runs when ever the variable(s) change
  // 3. Multiple variables are given, then when any one changes the function runs

  // If we return a function for the first arguement function in useEffect then it acts as a cleanup
  // function and runs before NEXT time the use effect 1st arguement function executes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const queryParams =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest(
          "https://react-hooks-demo-ad70f-default-rtdb.firebaseio.com/ingredients.json" +
            queryParams,
          "GET"
        );
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }
      console.log(loadedIngredients);
      //Trigger something in Ingredients
      onLoadIngredients(loadedIngredients);
    }
  }, [data, isLoading, error, onLoadIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(event) => {
              const value = event.target.value;
              setEnteredFilter(value);
            }}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
