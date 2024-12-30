import "./App.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./loginpage/loginpage";
import RegisterPage from "./registpage/registpage";
import IndexPage from "./home/indexpage/indexpage";
import UserSettings from "./home/settingpage/settingpage";

function App() {
  return (
    <div id="app">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home/*" element={<IndexPage />} />
        <Route path="/userInfo/settings" element={<UserSettings />} />
      </Routes>
    </div>
  );
}

export default App;