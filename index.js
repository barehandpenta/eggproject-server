const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views','./views');
app.use(express.static('public'));

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);

io.on('connection', socket => {
  console.log("hello " + socket.id);
  socket.on("image", imgData => {
    io.emit("imgData", imgData);
  });
});

app.get('/', (req,res) => res.render('home.ejs'));
