import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateRoom from './CreateRoom';
import JoinRoomForm from './JoinRoom';
import Dashboard from './dashBoard';
import Home from './view/home';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<CreateRoom />} />
          <Route component={Home} exact path="/home" />
          <Route path="/dashboard" element={<Dashboard authed={true}/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
