const express = require('express');
const router = express.Router();
const transferRecord = require('./../models/transferRecords');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');



const ThingSchema = new mongoose.Schema({
    _id: String,
    name: String,
    currentBalance: Number,
    mobileNumber: String,
    email: String,
    otherDetails: String,
    gender: String,
    DOB: String
});

const customerModel = mongoose.model('customerModel', ThingSchema, 'Customers');

router.get('/', (req, res) => {
    customerModel.find({}, (err, customer) => {
        if (err) console.log("OOps");
        else {

            res.render("customers", { customerlist: customer });

        }

    })

});
router.get('/customerDetail/:id', (req, res) => {
    customerModel.findOne({ _id: req.params.id }, (err, customDetail) => {
        if (err) console.log("OOps");
        else {

            res.render("customerDetail", { customerDetail: customDetail })
        }
    })


});
router.get('/transfermoney/:id', (req, res) => {

    customerModel.find({}, (err, customer) => {
        if (err) console.log("OOps");
        else {
            customerModel.findOne({ _id: req.params.id }, (err, customDetail) => {
                if (err) console.log("OOps");
                else {

                    res.render("transferMoney", { customerDetail: customer, customerDetailOption: customDetail })
                }
            })



        }

    })
});

router.get('/transfermoney/error', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write("<h1>Something went Wrong</h1><h3>Please check your Account Balance!!!</h3> ");
    res.send();


})

router.post('/transfermoney', (req, res) => {

    let transfer = new transferRecord({
        from: req.body.from,
        to: req.body.to,
        amount: req.body.amount
    })
    if (transfer.from === "--Choose the Customer--" || transfer.to === "--Choose the Customer--") {

        res.redirect('/customers')

    } else {
        customerModel.findOne({ name: transfer.from }, async function(err, response) {

            if (err) console.log(err);
            else {

                if (response.currentBalance >= transfer.amount) {
                    console.log(response.currentBalance, transfer.amount)
                    const balance = response.currentBalance - transfer.amount
                    customerModel.updateOne({ name: transfer.from }, { currentBalance: balance }, function(er) {
                        if (er) console.log(er);
                        else {
                            console.log('changed successfully');
                        }

                    });
                    // for 'to' field
                    customerModel.findOne({ name: transfer.to }, function(err, response) {
                        if (err) console.log(err);
                        else {
                            const balance = response.currentBalance + transfer.amount
                            customerModel.updateOne({ name: transfer.to }, { currentBalance: balance }, function(er) {
                                if (er) console.log(er);
                                else {
                                    console.log('changed successfully');

                                }

                            })

                        }

                    });
                    try {
                        transfer = await transfer.save()
                        res.redirect('/customers')


                    } catch (e) {
                        console.log(e)
                        res.redirect('/customers/transfermoney/error')

                    }

                } else {
                    res.redirect('/customers/transfermoney/error')

                }





            }
        });


    }
});

router.get('/allTransactions', (req, res) => {
    let tmodel = new transferRecord({
        from: "",
        to: "",
        amount: ""
    });
    transferRecord.find({}, (err, transferRec) => {
        if (err) console.log(err)
        else {

            res.render("transferRecords", { Rec: transferRec });


        }


    })


})


module.exports = router;