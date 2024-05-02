import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={localStorage.getItem("auth") ? <Index /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;
