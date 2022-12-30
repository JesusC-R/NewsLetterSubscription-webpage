// STEP 1: Install all packages required from the terminal.
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");

// STEP 4: use the static method to access static files.
const {static} = require("express");
const app = express();

// STEP 5: use body-parser to process data from signup.html document.
app.use(bodyParser.urlencoded({extended: true}));

app.use(static("public"));

// STEP 3: Use app.get() method to submit our signup.html document to the client.
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

// STEP 6: Make a post request to process user input and access data with body-parser.
app.post("/", function(req, res){
   let firstName = req.body.firstName;
   let lastName = req.body.lastName;
   let email = req.body.email;


   // STEP 7: Format the user data and use JSON stringify method.
   const data = {
       members: [
           {
               email_address: email,
               status: "subscribed",
               merge_fields: {
                   FNAME: firstName,
                   LNAME: lastName,
               }
           }
       ]
   };
   const jsonData = JSON.stringify(data);

   // STEP 8: Acquire MailChimp API key and list ID.
   const listID = "24cf271774";
   const apiKey = "d4682bd7709a6d31c28ece42ecf65a70-us21"
   const URL = "https://us21.api.mailchimp.com/3.0/lists/" + listID;


   const options = {
       method: "POST",
       auth: "Helix:" + apiKey
   }

   // STEP 9: Create an HTTPS request to MailChimp servers and print the data.
   const request = https.request(URL, options, function(response){
       response.on("data", function (data){
           console.log(JSON.parse(data));

           if(response.statusCode !== 200){
               res.sendFile(__dirname + "/failure.html");
           }
           res.sendFile(__dirname + "/success.html");
       });
   });

   // STEP 10: Send the request to the client and end the request's process.
   // request.write(jsonData);
   request.end();
});

// STEP 11: If there is an error redirect the user to the sign-up page again
app.post("/failure", function (req, res){
    res.redirect("/");
});

// STEP 2: Create and host the server on port 3000.
app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000");
});
