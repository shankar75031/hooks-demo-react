import React, { useReducer, useState, useCallback } from "react";
import ErrorModal from "../UI/ErrorModal";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

// useReducer is usually created outside component so that it is not called again on re-rendered
// React will re-render component when reducer returns a new state
const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get here!");
  }
};

const Ingredients = (props) => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // useCallback caches the value of the function it will only rerun only if one of the dependant variables changes. re-rendering of component won't call function.
  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);
    fetch(
      "https://react-hooks-demo-ad70f-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => {
        setIsLoading(false);

        return res.json();
      })
      .then((responseData) => {
        dispatch({ type: "ADD", ingredient: ingredient });
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true);
    fetch(
      `https://react-hooks-demo-ad70f-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        setIsLoading(false);
        dispatch({ type: "DELETE", id: ingredientId });
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      });
  };

  const clearError = () => {
    // Two state changes will be batched by React to avoid unnecessary re-render cycles
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
