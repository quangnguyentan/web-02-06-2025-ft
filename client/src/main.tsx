import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "@/App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import reduxStore from "@/store";
import { SelectedPageProvider } from "./components/navigation/navigation-provider";

const { store, persistor } = reduxStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <SelectedPageProvider
          initialPage="TRANG CHỦ"
          inititalSportsNavbarPage=""
        >
          <App />
        </SelectedPageProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
