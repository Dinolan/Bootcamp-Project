const http = require('http');
const app = require('./app')
const port = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(port);

function serverWorking(port){
    if(port ===5000 || process.env.PORT)
    {
        return true;
    }
    else{
        return false;
    }
}

module.exports = serverWorking;