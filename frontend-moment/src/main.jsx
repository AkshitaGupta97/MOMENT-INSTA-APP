//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './redux/store.js';
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
    <AppContextProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={store.persistor}>
          <App />
        </PersistGate>
      </Provider>
    </AppContextProvider>
  </BrowserRouter>
)
