//Imported variables
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose').default;
const Product = require('../models/product');
const checkAuth = require('../authorization/authorization_check')
const logger = require('../../logger/logger');
const axios = require('axios');




//The GET function will access the current vehicles in the database
router.get('/', (req,res,next) => {
  Product.find()
      .select('name price _id year model')
      .exec()
      .then(vehicles =>{
          const response = {
              count: vehicles.length,
              products: vehicles.map(eachVehicle => {
                  return {
                      name: eachVehicle.name,
                      model: eachVehicle.model,
                      year: eachVehicle.year,
                      price: 'R '+ eachVehicle.price,
                      _id: eachVehicle._id
                  }
              })
          };
          //Returns a successful response
          logger.customerLogger.log('info','Vehicle list displayed successfully');
          res.status(200).json(response);

      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              //Returns that there has been an error
              error:err

          });
          logger.customerLogger.log('error','Vehicle list could not be displayed');
      });
});

//Test
async function vehicleYear(vehicleID)
{
    try{
        const result = await fetch(
            `https://localhost:5000/products/${vehicleID}`
        );

        const data = await result.json("year");
        return data;
    } catch(e){
        return null
    }
}






//The POST function handles adding new vehicles to the inventory
//Note: There is authentication used for this one via JWT
//This check happens before the product is created
router.post('/', checkAuth,(req,res,next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        year: req.body.year,
        model:req.body.model
    });
    product
        .save()
        .then(result => {
        console.log(result);
            logger.customerLogger.log('info','New vehicle successfully added to inventory ');
            res.status(201).json({
                message: 'New Vehicle Added To Inventory',
                createdProduct: {
                    name: result.name,
                    model: result.model,
                    year: result.year,
                    price: 'R '+result.price,
                    _id: result._id
                }
            });
    }).catch(err => {
        console.log(err);
        //Returns that there has been an error
        res.status(500).json({
            error:err
        });
        logger.customerLogger.log('error','Cannot add new vehicle to inventory');
    });


});

//The GET function can access a single vehicle from the database using the ID
router.get('/:productId', (req,res,next) => {
    const id = req.params.productId;

    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("from database", doc);
            if(doc)
            {
                res.status(200).json(doc);
                logger.customerLogger.log('info','Vehicle information successfully displayed');
            }
            else
            {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
                logger.customerLogger.log('error','Vehicle information could not be displayed');
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
            logger.customerLogger.log('error','Vehicle information could not be displayed');
        });
});

//The PATCH function allows for updating a property of an existing vehicle
router.patch('/:productId', (req,res,next) => {
    const id = req.params.productId;
    const updateVehicle= {};

    for(const property of req.body) {
        updateVehicle[property.updateVehicle] = property.value;
    }
    Product.update({_id: id }, {$set: updateVehicle })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Vehicle List Has Been Updated',
                result
            });
            logger.customerLogger.log('info','Vehicle information has been updated successfully');
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
            logger.customerLogger.log('error','Vehicle information could not be updated');
        });
});


//The DELETE function will access a vehicle and remove it from the inventory
router.delete('/:productId', (req,res,next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(
            Product.remove({_id: id})
            .exec()
            .then( result => {
                res.status(200).json({
                    message: 'Vehicle Has Been Removed From Inventory'
                });
                logger.customerLogger.log('info','Vehicle has been successfully removed from inventory');

            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
                logger.customerLogger.log('error','Vehicle could not be removed from inventory');
            })
        )
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
            logger.customerLogger.log('error','Vehicle could not be removed from inventory');
        })
});


//The PUT function is for changing the entire vehicle entry
//Coded very similar to the PATCH function
router.put('/:productId', (req,res,next) => {
    const id = req.params.productId;
    const updateVehicle= {};

    for(const property of req.body) {
        updateVehicle[property.updateVehicle] = property.value;
    }
    Product.update({_id: id }, {$set: updateVehicle })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Vehicle List Has Been Updated',
                result
            });
            logger.customerLogger.log('info','Vehicle information has been updated successfully');
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
            logger.customerLogger.log('error','Vehicle information could not be updated');
        });
});

module.exports = router;
module.exports = vehicleYear;