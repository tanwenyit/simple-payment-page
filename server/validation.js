/* eslint-disable no-unused-vars */
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');

// enable CORS for request verbs
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
    res.header("Access-Control-Allow-Methods","POST, GET, PUT, DELETE, OPTIONS");  
    next();
});

app.use(bodyParser.urlencoded({  
    extended: true  
}));  
  
app.use(bodyParser.json());

// Handle validation using POST method
app.post('/validation/handler', (req, res) => {
    let 
    status = "VALID",
    message = "";
    try {
        console.log(req.body.card);
        // Only accept AMEX, VISA, MASTERCARD
        let 
        cardNumber = req.body.card.card_no,
        exp_month = req.body.card.exp_month,
        exp_year = req.body.card.exp_year,
        cvv = req.body.card.cvv;

        // 1. check expiry date
        let 
        today = new Date(),
        card_date = new Date("20" + exp_year, exp_month);
        
        if(parseInt(exp_month) > 12 || parseInt(exp_month) < 1) {
            message = "Invalid date";
            status = "INVALID";
        }

        if(parseInt(exp_year) < 1) {
            message = "Invalid date";
            status = "INVALID";
        }

        if(card_date < today) {
            message = "Card Expired";
            status = "INVALID";
        }

        // 2. check CVV
        let mii = cardNumber.toString().slice(0,2),
        amex = ['34','37'],
        visa = ['4'],
        mastercard = ['51','52','53','54','55'];
        // AMEX: 34 or 37
        // MASTERCARD: 51-55
        // VISA: 4
        // Ref: https://en.wikipedia.org/wiki/Payment_card_number
        if(amex.includes(mii)) {
            if(cvv.toString().length !== 4) {
                message = "Incorrect CVV length";
                status = "INVALID";
            }
        }
        else if(mastercard.includes(mii)) {
            if(cvv.toString().length !== 3) {
                message = "Incorrect CVV length";
                status = "INVALID";
            }
        }
        else if(visa.includes(mii[0])) {
            if(cvv.toString().length !== 3) {
                message = "Incorrect CVV length";
                status = "INVALID";
            }
        }

        // 3. check card_no length in between 16 and 19 digits
        if(cardNumber.toString().length < 16 || cardNumber.toString().length > 19) {
            message = "Incorrect card number size";
            status = "INVALID";
        }

        // 4. check last digit of card no using luhn's algorithm.
        if(!luhnAlgorithm(cardNumber.toString())) {
            message = "Unmatched checksum digit";
            status = "INVALID";
        }

    } catch (err) {
        // console.log(err)
        return res.status(500).send(err);
    } finally {
        if(status == "VALID") {        
            return res.status(200).send({
                message: req.body.card,
                status: status
            });
        } else {        
            return res.status(200).send({
                message: message,
                status: status
            });
        }
    }
});

var server = app.listen(8081, () => {
    // var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://localhost:%s", port)
    // console.log("Example app listening at http://%s:%s", host, port)
});

// Run this server using the command: node validation.js

function luhnAlgorithm(cardNumber) {
    let 
    givenCheckDigit = parseInt(cardNumber[cardNumber.length - 1]),
    acc_numbers = cardNumber.slice(0, cardNumber.length - 1),
    acc_numbers_length = acc_numbers.length,
    sumDigit = 0,
    parity = (cardNumber.length - 2) % 2,
    calculatedCheckDigit = 0;

    for(let i=0; i < acc_numbers_length; i++) {
        let digit = parseInt(acc_numbers[i])
        if(i % 2 == parity) { digit *= 2; }
        if(digit > 9) { digit -= 9; }
        sumDigit += digit
    }
    
    calculatedCheckDigit = 10 - (sumDigit % 10)

    console.log('given checksum: ', givenCheckDigit)
    console.log('calculated checksum: ', calculatedCheckDigit)
    if(givenCheckDigit == calculatedCheckDigit) {
        return true;
    } else { return false; }
}
