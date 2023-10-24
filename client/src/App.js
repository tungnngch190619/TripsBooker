import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import {ViewportProvider} from './ViewportContext'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMagnifyingGlass, faAngleLeft, faAngleRight, faLock, faPlus, faPenToSquare, faLockOpen, faKey, faTrash, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import Login from './pages/Login/Login';
import Users from './pages/Users/Users';
import ProtectedRoute from './components/ProtectedRoute';
import { useSelector } from 'react-redux';
import AccessDenied from './components/AccessDenied';
import Drivers from './pages/Drivers/Drivers';
import Lines from './pages/Lines/Lines';

function App() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  const role = useSelector((state) => state.user.role)
  const tokenExpired = useSelector((state) => state.user.tokenExpired)
  return (
    <Router>
      <ViewportProvider>
        <Routes>
          <Route element={<ProtectedRoute conditional={isAuthenticated===true} redirect={<Navigate to="/login"/>}/>}>
            <Route element={<ProtectedRoute conditional={role==="Admin"} redirect={<Navigate to="/accessDenied" replace/>}/>}>
              <Route exact path="/users" element={<Users/>}/>
            </Route>
            <Route element={<ProtectedRoute conditional={role==="Staff" || role==="Admin"} redirect={<Navigate to="/accessDenied" replace/>}/>}>
              <Route exact path="/drivers" element={<Drivers/>}/>
              <Route exact path="/" element={<Lines/>}/>
              <Route exact path="/lines" element={<Lines/>}/>
            </Route>
          </Route>
          <Route element={<ProtectedRoute conditional={isAuthenticated===false} redirect={<Navigate to="/"/>}/>}>
            <Route exact path="/login" element={<Login tokenExpired={tokenExpired}/>} />
          </Route>
          <Route exact path="/accessDenied" element={<AccessDenied/>} />
        </Routes>
      </ViewportProvider>
    </Router>
  );
}

export default App;
library.add(
  faMagnifyingGlass,
  faAngleLeft,
  faAngleRight, 
  faLock, 
  faPlus, 
  faPenToSquare, 
  faSquare,
  faSquareCheck, 
  faLockOpen, 
  faKey, 
  faTrash,
  faChevronDown,
  faChevronUp,)