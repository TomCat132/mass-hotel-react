import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./loginpage/loginpage"; 
import RegisterPage from './registpage/registpage';
import IndexPage from "./home/indexpage/indexpage";
import UserSettings from './home/settingpage/settingpage'
// import HomePage from "./home/homepage";
function App() {
  return (
    <Router>
      <div id="app">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='/home/*' element={<IndexPage />} />
          <Route path="/userInfo/settings" element={<UserSettings />} /> {/* 添加三级路由 */}
          {/* <Route path='/home/homepage' element={<HomePage />} /> */}
       
        </Routes>
      </div>
    </Router>
  );
}

export default App;