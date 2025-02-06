import { UserProvider } from "./providers/UserContext";
import { PrimeReactProvider } from 'primereact/api';
import { ToastContainer } from "react-toastify"
import DesafioFullRoutes from "./routes/DesafioFullRoutes"
import 'react-toastify/dist/ReactToastify.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';


const App = () => {

  return (
    <div className="App">

      <PrimeReactProvider  >
        <UserProvider>
          <DesafioFullRoutes />
        </UserProvider>

      </PrimeReactProvider>

      <ToastContainer />
    </div>
  )
}

export default App