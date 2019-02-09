var http = require('http');
var fs = require('fs');






// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
  fs.readFile('./index.html', 'utf-8', function(error, content) {
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(content);
  });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console

io.sockets.on('connection', function (socket) {
        console.log("un utilisateur arrive !");
        socket.emit('message', 'Vous êtes bien connecté !');

        socket.on('petit_nouveau', function(pseudo) {
          console.log("petit_nouveau : " + pseudo );
          socket.idUser = 1 + Math.floor(Math.random() * 9999);
          socket.pseudo = pseudo;
          socket.broadcast.emit('user', pseudo);
        });
        socket.on('position', function (position) {
          console.log(socket.idUser+','+socket.pseudo + ',' + position.X+','+position.Y);
          Deplacement(socket.idUser,socket.pseudo,position.X,position.Y)
          // console.log('Coordonnée souris position X : ' + socket.pseudo + position['X'] + position['Y']);
        });
        function Deplacement(idUser,nom,positionX,positionY) {
          socket.broadcast.emit('nouveaudeplacement', {'idUser' : idUser, 'pseudo' : nom, 'positionX' : positionX, 'positionY' : positionY});
        }

});


server.listen(8080);
