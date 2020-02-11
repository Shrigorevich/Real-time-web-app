const express = require('express');
const app = express();

const rp = require('request-promise');

const server = require('http').Server(app);

const io = require('socket.io')(server);

const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  qs: {
    'start': '1',
    'limit': '24',
    'convert': 'USD'
  },
  headers: {
    'X-CMC_PRO_API_KEY': '8cfff0c9-8d59-45bf-81da-81bfeaf62801'
  },
  json: true,
  gzip: true
};

app.get('/', function(req, res){
   res.sendFile(__dirname + '/index.html');
})

server.listen(3000, function(){
   console.log('HTTP sever started on port 3000');
});

io.on('connection', function(socket){
   console.log('Client connection received');

   rp(requestOptions).then(response => {

     let jsonData = { "data" : JSON.parse(JSON.stringify([...response['data']]))}
     socket.emit('sendToClient', jsonData );

   }).catch((err) => {
     console.log('API call error:', err.message);
   });

   socket.on('receivedFromClient', function(data){
      console.log(data);
   })
})

function delay() {
   return new Promise(resolve => setTimeout(resolve, 31500));
}

async function f1(){
   let jsonData = '';
  setInterval(async () => {
     await delay();
     rp(requestOptions).then(response => {
       jsonData = { "data" : JSON.parse(JSON.stringify([...response['data']])) }
       io.emit('sendToClient', jsonData)
     })
  }, 31500);
}
f1();
