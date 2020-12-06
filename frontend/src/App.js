import './App.scss';
import './Circles.scss'
import Sidebar from "./Components/Sidebar";
import Circles from "./Components/Circles";
import {BrowserRouter as Router, Route, Switch,  Redirect } from "react-router-dom";

//Pages
import Mainpage from "./pages"
import addClient from "./pages/addClient"
import calificacionInterna from "./pages/calificacionInterna"
import verificaciones from "./pages/verificaciones"
import NotFound from "./pages/404"

function App() {
  return (
    <div className="App">
    <Router>
    <div className = "Main__Body">
      <Sidebar/>
    <div className = "Main__Body__Panel">
      <Switch>
        <Route exact path="/">
        <Redirect to="/home" />
        </Route>
        <Route exact path="/Home" activeClassName="Home" component={Mainpage} />
        <Route exact path="/AddClient" component={addClient}/>
        <Route exact path="/Verificaciones" component={verificaciones}/>
        <Route exact path="/CalificacionInterna" component={calificacionInterna}/>
        <Route component={NotFound}/>
      </Switch>
      </div>
      </div>
    </Router>
    <Circles/>
    </div>
    );
}

export default App;
