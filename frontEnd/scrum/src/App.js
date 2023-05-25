import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateRoom from './CreateRoom';
import JoinRoomForm from './JoinRoom';
import Dashboard from './dashBoard';
import Home from './view/home';
import VotePage from './votePage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<CreateRoom />} />
          <Route path="/dashboard" element={<Dashboard authed={true}/>} />
          <Route path="/vote" element={<VotePage authed={true}/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
