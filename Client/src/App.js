import { Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";

function App() {
  return (
    <Route>
      <Route path="/" element={<Home />} />
    </Route>
  );
}

export default App;
