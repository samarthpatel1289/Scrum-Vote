import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [socket, setSocket] = useState([null]);
  const [message, setMessage] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState('');

  useEffect(() => {
    // Create a new WebSocket instance
    const ws = new WebSocket('localhost:8080');

    // Set the WebSocket instance as the state
    setSocket([ws]);

    // Add an event listener for receiving messages from the server
    ws.addEventListener('message', (event) => {
      // Add the received message to the state
      setReceivedMessages(event.data);
    });

    // Close the WebSocket connection when the component unmounts
    return () => ws.close();
  }, []);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Send the message to the server
    socket[0].send(message);
  };

  return (
    <div className='container'>
      <form onSubmit={handleFormSubmit}>
        <input type='text' value={message} onChange={handleInputChange} />
        <button type='submit'>Send</button>
      </form>
      <ul>
        <li>
        {receivedMessages}
        </li>
      </ul>
    </div>
  );
}

export default App;
