// const url = 'ws://localhost:8000';
const url = 'wss://battleshipgame-backend-b26558eb5106.herokuapp.com';
const connection = new WebSocket(url);

connection.onerror = (error) => {
    console.error('WebSocket error: ', error);
};
  
connection.onopen = () => {
    console.log('WebSocket connection is open');
};

// connection.onmessage = (event) => {
//     console.log('WebSocket message received:', event.data);
// };

connection.onclose = () => {
    console.log('WebSocket connection closed');
};

export default connection;




