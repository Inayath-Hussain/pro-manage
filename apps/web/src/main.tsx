import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux"

import App from './App.tsx';
import { store } from './store/index.ts';
import "./styles.css";
import "./reset.css";
import ModalContextProvider from './context/modal.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>

        <ModalContextProvider>
          <App />
        </ModalContextProvider>

      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)