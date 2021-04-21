import React, { useReducer, useCallback, useMemo, useEffect } from "react";
import useHttp from "../../hooks/http";
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

  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  // Set up hooks at the beginning of the function
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifier,
    clear,
  } = useHttp();

  useEffect(() => {
    console.log("DATA");
    console.log(data);
    if (!isLoading && !error && reqIdentifier === "REMOVE_INGREDIENT") {
      console.log("DELTETE");
      dispatch({ type: "DELETE", id: reqExtra });
    } else if (!isLoading && data && reqIdentifier === "ADD_INGREDIENT") {
      console.log("ADD");
      console.log(data);
      dispatch({ type: "ADD", ingredient: { id: data.name, ...reqExtra } });
    }
  }, [isLoading, error, data, reqExtra, reqIdentifier]);

  // useCallback caches the value of the function it will only rerun only if one of the dependant variables changes. re-rendering of component won't call function.
  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback(
    (ingredient) => {
      sendRequest(
        "https://react-hooks-demo-ad70f-default-rtdb.firebaseio.com/ingredients.json",
        "POST",
        JSON.stringify(ingredient),
        ingredient,
        "ADD_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    (ingredientId) => {
      sendRequest(
        `https://react-hooks-demo-ad70f-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
        "DELETE",
        null,
        ingredientId,
        "REMOVE_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const clearError = useCallback(() => {
    // Two state changes will be batched by React to avoid unnecessary re-render cycles
    // setError(null);
    // setIsLoading(false);
  }, []);

  //  Use memo can be used to prevent re-rendering always when a component re-renders.
  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
