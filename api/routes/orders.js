//Imported variables
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose').default;
const Order = require('../models/order');
const Product = require('../models/product');
const logger = require('../../logger/logger');


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
                })
            });
            logger.customerLogger.log('info','Order list displayed successfully');
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
            logger.customerLogger.log('error','Order list could not be displayed');
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
                logger.customerLogger.log('error','Order not placed. Vehicle does not exist');
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
                    logger.customerLogger.log('info','Order placed successfully');
                })

        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
            logger.customerLogger.log('error','Order could not be placed');
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
                logger.customerLogger.log('error','Vehicle not found');

            }
            res.status(200).json({
                order: order,
            });
            logger.customerLogger.log('info','Vehicle information displayed succesfully');
        })
        .catch(err => {
            req.status(500).json({
                error: err
            });
            logger.customerLogger.log('error','Vehicle could not be found');
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
            logger.customerLogger.log('info','Order has been removed successfully');
        })
        .catch(err => {
            req.
            status(500).json({
                error: err
            });
            logger.customerLogger.log('error','Order could not be removed');
        });
});

module.exports = router;