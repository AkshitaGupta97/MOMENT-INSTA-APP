import { createContext, useContext } from "react";
import axios from "axios";

export const AppContext = createContext();

const backendUrl = "http://localhost:8000"; // your backend

// create axios instance with prefix
const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

export const AppContextProvider = ({ children }) => {
  const value = {
    backendUrl,
    axios: api,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// custom hook
export const useAppContext = () => useContext(AppContext);
