import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./screens/HomePage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
