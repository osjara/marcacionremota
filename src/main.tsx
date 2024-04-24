import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NextUIProvider } from '@nextui-org/react'
import { store } from './store/store.ts'
import { Provider as ReduxProvider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <main className="dark">
      <ReduxProvider store = {store}>
        <App />
      </ReduxProvider>
      </main>
    </NextUIProvider>
  </React.StrictMode>,
)
