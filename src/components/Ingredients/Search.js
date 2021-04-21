import React, { useState, useEffect } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");

  // Gets executed whenever a component has finished rendering
  // Second arguement:
  // 1. If empty array it runs only once after the component is first rendered
  // 2. If any variable(s) then first function runs when ever the variable(s) change
  useEffect(() => {
    setTimeout(() => {}, 500);
    const queryParams =
      enteredFilter.length === 0
        ? ""
        : `?orderBy=\"title\"&equalTo=\"${enteredFilter}\"`;
    fetch(
      "https://react-hooks-demo-ad70f-default-rtdb.firebaseio.com/ingredients.json" +
        queryParams
    )
      .then((res) => {
        return res.json();
      })
      .then((responseData) => {
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount,
          });
        }
        //Trigger something in Ingredients
        onLoadIngredients(loadedIngredients);
      })
      .catch((err) => console.log(err));
  }, [enteredFilter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
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
