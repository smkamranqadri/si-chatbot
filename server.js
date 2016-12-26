var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();


app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('hello world, i am chatbot');
});

//For facebook verification
app.get('/webhook', function(req, res){
    if(req.query['hub.verify_token'] === 'i_am_chatbot_verify_me'){
        res.send(req.query['hub.challenge']);
    }
    res.send('error, wrong token');
});
//App start sending replies
app.post('/webhook/', function(req, res){
    var messagingEvents = req.body.entry[0].messaging;
    for(var i = 0; i < messagingEvents.length; i++){
        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;
        if(event.message && event.message.text){
            var text = event.message.text;
            if(text === "Hi"){
                text = "Hello";
                sendTextMessage(sender, text.substring(0, 200));
            }
            else {
                text = "Sorry, I can't give you more information";
                sendTextMessage(sender, text.substring(0, 200));
            }
        }
    }
    res.sendStatus(200);
});

function sendTextMessage(sender, text) {
    console.log('sender', sender);
    console.log('text', text);
    var messageData = { text: text };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: 'EAAaZAcZBsTLJUBABHpdZAX5o2ERkrNwOGjDq3VMmfhjyM1pAwKm6MaUdeIyuIFT4sYNDL9ZBsDY8sVPcSXxrNlYkFCAmpf1obFnok1rr213JGopZCmiBeAQhvjpNZCBihMHWkTYZCApomR7r6t244OZA5LrbdhVUSitUBLoZAcagCkAZDZD'},
        method: 'POST',
        json: {
            recipient: {id: sender },
            message: messageData
        }
    }, function(error, response) {
        if (error) {
            console.log('Error sending messages: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    })
}

//Start the server
app.listen(app.get('port'), function(){
   console.log('running on port ', app.get('port'));
});