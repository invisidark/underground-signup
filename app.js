const express = require('express');
const bodyParser = require("body-parser");
const request = require("request");
const https = require('https');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");

});

app.post("/", function(req, res) {
    const firstName = req.body.fName
    const lasttName = req.body.lName
    const email = req.body.email


    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lasttName
                }
            }
        ]
    };


    var jsonData = JSON.stringify(data);

    const apiKey = process.env.MAILCHIMP_API_KEY;
    const listId = 'e58ada7f2b';
    const url = `https://us20.api.mailchimp.com/3.0/lists/${listId}`;


    const options = {
        method: "POST",
        auth: `V:${process.env.MAILCHIMP_API_KEY}`

    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");

        }


        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });

    });

    request.write(jsonData);
    request.end();


    // console.log(firstName, lasttName, email);



});


app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000.")
});




