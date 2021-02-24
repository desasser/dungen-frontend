import './App.css';
import NavBar from "./components/NavBar/index"
import Login from "./pages/Login/Login";

function App() {
  return (
    <div className="App">
      <NavBar />
      <header className="App-header">
        <h1 className="text-2xl text-header">DUNGEN: JUNK WIZARDS</h1>
        <Login />
      </header>
    </div>
  );
}

export default App;
