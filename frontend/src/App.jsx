import { BrowserRouter} from "react-router-dom";
import Routes from "./Routes/routes";
import { AuthProvider } from "./features/auth/auth.context";
import "./shared/Global.scss"
export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
