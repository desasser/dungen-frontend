import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MapBuilder from './pages/MapBuilder';
import NavBar from "./components/NavBar/index"
import Login from "./pages/Login/Login";

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <h1 className="text-2xl text-header">DUNGEN: JUNK WIZARDS</h1>
      </header> */}
      <Router>
        <Switch>
          {/* <Route exact path="/" component={Home} />
        <Route exact path="/home" component={Home} /> */}
          <Route exact path="/dashboard" component={MapBuilder} />
        </Switch>
      </Router>
      <NavBar />
      <header className="App-header">
        <h1 className="text-2xl text-header">DUNGEN: JUNK WIZARDS</h1>
        <Login />
      </header>
    </div>
  );
}

export default App;
