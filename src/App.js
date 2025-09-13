import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import Schemes from './components/Schemes';
import HowToApply from './components/Howtoapply';
import About from './components/About';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Support from './components/Support';

function App() {
  return (
    <div>
      <BrowserRouter basename="/scholarship">
        <Navbar></Navbar>
        <Routes>
          <Route exact path='/' element={<Home></Home>}></Route>
          <Route exact path='/schemes' element={<Schemes></Schemes>}></Route>
          <Route exact path='/how-to-apply' element={<HowToApply></HowToApply>}></Route>
          <Route exact path='/about' element={<About></About>}></Route>
          <Route exact path='/login' element={<Login></Login>}></Route>
          <Route exact path='/signup' element={<SignUp></SignUp>}></Route>
          <Route exact path='/support' element={<Support></Support>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
