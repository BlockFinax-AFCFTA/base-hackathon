import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Web3Provider } from "./context/Web3Context";
import { AppProvider } from "./context/AppContext";

createRoot(document.getElementById("root")!).render(
  <Web3Provider>
    <AppProvider>
      <App />
    </AppProvider>
  </Web3Provider>
);
