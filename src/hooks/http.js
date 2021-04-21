import { useCallback, useReducer } from "react";

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

// HTTP Reducer is defined outside hook because hooks will get re=rendered when component using it re-renders
const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case "RESPONSE":
      return {
        ...currentHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case "ERROR":
      return {
        loading: false,
        error: action.error,
      };
    case "CLEAR":
      return initialState;
    default:
      throw new Error("Should not get here!");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      dispatchHttp({ type: "SEND", identifier: reqIdentifier });
      fetch(url, {
        method: method,
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          dispatchHttp({
            type: "RESPONSE",
            responseData: responseData,
            extra: reqExtra,
          });
        })
        .catch((err) => {
          console.log(err);
          dispatchHttp({ type: "ERROR", error: err.message });
        });
    },
    []
  );

  const clear = useCallback(() => {
    dispatchHttp({ type: "CLEAR" });
  }, []);

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    clear: clear,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
  };
};

export default useHttp;
