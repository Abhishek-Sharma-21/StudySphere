import { Routes, Route } from "react-router-dom";
import { RouteIndex } from "./components/RouteNames/RouteName";
import MainLayout from "./layout/MainLayout";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path={RouteIndex} element={<MainLayout />}></Route>
      </Routes>
    </div>
  );
};
export default App;
