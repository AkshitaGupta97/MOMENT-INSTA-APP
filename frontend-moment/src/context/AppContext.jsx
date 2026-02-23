import { createContext, useContext } from "react";
import axios from "axios";

export const AppContext = createContext();

// ✅ Use environment variable instead of localhost
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

export const AppContextProvider = ({ children }) => {
  const value = {
    backendUrl,
    axios: api,
  };

  console.log("Axios baseURL:", api.defaults.baseURL);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);