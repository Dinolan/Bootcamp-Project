//Imported variables
const http = require('http');
const app = require('./app')

//Setting the port
//process.env.PORT is a dynamic setting that is useful in deployment
//Otherwise we default to 5000 for this particular project
const port = process.env.PORT || 5000;

//Creating server
const server = http.createServer(app);
server.listen(port);











/*
function serverWorking(port){
    if(port ===5000 || process.env.PORT)
    {
        return true;
    }
    else{
        return false;
    }
}

module.exports = serverWorking;*/
