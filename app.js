//Dependency variables
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose').default;
const axios = require("axios");

//Route variables
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');



//Connecting to MongoDB
const connectionURL = `mongodb+srv://dinolan:${process.env.MONGO_ATLAS_PW}@bootcamp-node-js.ve5du3p.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(connectionURL);


//Morgan set to developer mode
app.use(morgan('dev'));

//Body parser resolves request bodies in a middleware before the handlers, available under the req.body property
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Cross Origin Resource Sharing Errors prevention
//'*' gives access to any origin
//Could also restrict it
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With,Content-Type,Accept,authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//Any input with /products , /orders, /users will be forwarded to the relevant routes below
app.use('/products' , productRoutes);
app.use('/orders' , orderRoutes);
app.use('/user', userRoutes);


/*axios.get('https://localhost:5000/products')
    .then(response => {
        console.log(response);
    });*/


//Error handling for the routes
//If the code gets to this point then non of the above endpoints were used
//Example:  http://localhost:5000/product
app.use((req,res,next) => {
    const error = new Error('Endpoint Not Found');
    error.status= 404;
    next(error);
})

//This handles any other server errors if the endpoints were used but are invalid
//Example: http://localhost:5000/products/k
app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;