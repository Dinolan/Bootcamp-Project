//Imported variables
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose').default;
const Order = require('../models/order');
const Product = require('../models/product');


////The GET function will access the current vehicles that have been ordered in database
router.get('/' , (req,res,next) => {
    Order.find()
        .select('product quantity _id name model year')
        .populate('product')
        .exec()
        .then(vehicles => {
            res.status(200).json({
                count: vehicles.length,
                orders: vehicles.map(eachVehicle => {
                    return {
                        _id: eachVehicle._id,
                        product: eachVehicle.product,
                        quantity: eachVehicle.quantity,
                    }
                }),
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//The POST function will act as the order vehicle functionality
router.post('/' , (req,res,next) => {

    Product.findById(req.body.productId)
        .then(product => {

            //Checking if the vehicle exists before ordering
            if(!product) {
                return res.status(404).json({
                    message: 'Vehicle not found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
           return order
                .save()
                .then( result => {
                    console.log(result);
                    console.log(result.name);
                    res.status(201).json({
                        message: 'Congratulations on your purchase!!!',
                        createdOrder: {
                            _id: result._id,
                            product: result.product,
                            quantity: result.quantity
                        }
                    });
                })

        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

//The GET function here will access information on a particular vehicle order
router.get('/:orderId' , (req,res,next) => {
    Order.findById(req.params.orderId)
        .exec()
        .then(order => {
            if(!order)
            {
                return res.status(404).json({
                    message: 'Order not found'
                });
            }
            res.status(200).json({
                order: order,
            });
        })
        .catch(err => {
            req.status(500).json({
                error: err
            });
        });
});

//The DELETE function will remove a particular vehicle order
router.delete('/:orderId' , (req,res,next) => {
    Order.remove({_id: req.params.orderId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order Has Been Removed',
                request: {
                    type: 'POST',
                    url: 'http://localhost:5000/orders',
                    body: {productId : 'ID', quantity: 'Number'}
                }
            });
        })
        .catch(err => {
            req.status(500).json({
                error: err
            });
        });
});

module.exports = router;