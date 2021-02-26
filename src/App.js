import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MapBuilder from './pages/MapBuilder';
import SavedMaps from './pages/SavedMaps';
import NavBar from "./components/NavBar/index"
import Login from "./pages/Login";

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <h1 className="text-2xl text-header">DUNGEN: JUNK WIZARDS</h1>
      </header> */}
      <NavBar />
      <Router>
        <Switch>
          {/* <Route exact path="/" component={Home} />
        <Route exact path="/home" component={Home} /> */}
          <Route exact path="/" component={Login}/>
          <Route exact path="/dashboard" component={MapBuilder} />
          <Route exact path="/usermaps" component={SavedMaps} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
