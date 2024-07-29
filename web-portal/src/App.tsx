import { useState } from "react";

import { BrowserRouter } from "react-router-dom";

import { AllRoutes } from "./services/routes";
import { FirebaseProvider } from "./context/FirebaseContext";
import { Loader, Footer } from "./components/shared";

export function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <FirebaseProvider loading={(loading) => setIsLoading(loading)}>
      {isLoading ? (
        <Loader size="full-screen" />
      ) : (
        <BrowserRouter>
          <AllRoutes />
          <Footer />
        </BrowserRouter>
      )}
    </FirebaseProvider>
  );
}
