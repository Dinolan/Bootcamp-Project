const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose').default;


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');


const url = `mongodb+srv://dinolan:${process.env.MONGO_ATLAS_PW}@bootcamp-node-js.ve5du3p.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url);



app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//CORS Errors prevention
//'*' gives access to any origin
//Could also restrict it
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With,Content-Type,Accept,Authorization');

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

//Anything with /products will be forwarded to the products.js file
app.use('/products' , productRoutes);

//Anything with /orders will be forwarded to the orders.js file
app.use('/orders' , orderRoutes);
app.use('/user', userRoutes);

//Error handling
app.use((req,res,next) => {
    const error = new Error('Not Found');
    error.status= 404;
    next(error);
})


app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }

    });
});

module.exports = app;