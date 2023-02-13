//Imported variables
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");      //Used to hash and salt passwords
const jwt = require('jsonwebtoken');   //Used for JWT authentication
const User = require("../models/user");
const logger = require('../../logger/logger');


//The POST function below handles the user sign up
router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            //This if statement checks if the user email already exists
            if (user.length >= 1) {
                logger.customerLogger.log('error','Signup Error: User email already exists');
                return res.status(409).json({
                    message: "Mail exists"
                });

            } else {
                //The bcrypt.hash is used for security, Salting = 10 add random strings to the password
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        logger.customerLogger.log('error','Could not signup');
                        //Checks for an error
                        return res.status(500).json({
                            error: err
                        });

                    } else {
                        //Creates a new user in the database
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                logger.customerLogger.log('info','User signed up successfully');
                                res.status(201).json({
                                    message: "User created",
                                    _id: result._id
                                });

                            })
                            .catch(err => {
                                console.log(err);
                                logger.customerLogger.log('error','Error with user signup');
                                res.status(500).json({
                                    //Checks for any other errors
                                    error: err
                                });

                            });
                    }
                });
            }
        });
});

//The POST function below handles the user login
router.post('/login',(req,res,next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            //First we check if the user exists in the database
            if(user.length < 1){
                logger.customerLogger.log('error','Log-In Authentication failed');
                return res.status(401).json({
                    message: 'Authentication failed'
                });

            }
            //The compare will check the encrypted password (Build in by bcrypt)
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {

                //If the password does not match then we throw an error
                    if(err){
                        logger.customerLogger.log('error','Log-In Authentication failed');
                        return res.status(401).json({
                            message: 'Authentication failed'
                        });

                    }
                    //Checks for match and authenticates user login
                    if(result){
                       const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        },
                            process.env.JWT_KEY,
                            {
                                //This is a build in function to have a timer on the access token
                                expiresIn: "2h"
                            });
                        logger.customerLogger.log('info','Log-In Authentication Successful');
                        return res.status(200).json({
                        message: 'Authentication successful',
                            token: token
                    })

                    }
                logger.customerLogger.log('error','Log-In Authentication failed');

                return res.status(401).json({
                    //If all else fails then we return an error here
                    message: 'Authentication failed'

                });


            });
        })
        .catch(err => {
            console.log(err);
            logger.customerLogger.log('error','Log-In Authentication failed');
            res.status(500).json({
                //Once again catching any errors during this process
                error: err
            });

        });
});

//The DELETE function below accesses a user and deletes that instance from the database
router.delete("/:userId", (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            logger.customerLogger.log('info','User has been deleted');
            res.status(200).json({
                message: "User deleted"
            });

        })
        .catch(err => {
            console.log(err);
            logger.customerLogger.log('error','User could not be deleted');
            res.status(500).json({
                error: err
            });

        });
});

module.exports = router;