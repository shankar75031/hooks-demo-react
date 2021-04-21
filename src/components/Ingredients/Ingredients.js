import React, { useEffect, useState } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = (props) => {
  const [userIngredients, setUserIngredients] = useState([]);

  // Gets executed whenever a component has finished rendering
  // Second arguement:
  // 1. If empty array it runs only once after the component is first rendered
  // 2. If any variable(s) then first function runs when ever the variable(s) change
  useEffect(() => {
    fetch(
      "https://react-hooks-demo-ad70f-default-rtdb.firebaseio.com/ingredients.json"
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
        setUserIngredients(loadedIngredients);
      })
      .catch((err) => console.log(err));
  }, []);

  const addIngredientHandler = (ingredient) => {
    fetch(
      "https://react-hooks-demo-ad70f-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((responseData) => {
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient },
        ]);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />
      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={() => {}} />
      </section>
    </div>
  );
};

export default Ingredients;
