import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  // Call useAuth session listener hook to subscribe to Firebase session state changes on load
  useAuth();

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}