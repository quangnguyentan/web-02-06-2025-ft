import { createRoot } from "react-dom/client";
import "./index.css";
import App from "@/App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import reduxStore from "@/store";
import { SelectedPageProvider } from "./components/navigation/navigation-provider";

import type { RootState, AppDispatch } from "@/store"; // FIX: Import types from your store file
import { DataProvider } from "./context/DataContext";

const { store, persistor } = reduxStore();
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <SelectedPageProvider
          initialPage="TRANG CHỦ"
          inititalSportsNavbarPage=""
        >
          <DataProvider>
            <App />
          </DataProvider>
        </SelectedPageProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
