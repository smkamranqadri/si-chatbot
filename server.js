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
    console.log('messagingEvents', messagingEvents);
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
    var messageData = { text: text };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: 'EAAQ9VLSks9gBAJmizjXNQAUQLZCam7EZAogYAPF6tSBHOPrwRRS9duzrq2Vh0d5VW145qya3CqXR2yjTjoIgTNNadDEvj9g3pbqwfeRh5cfKxr0pD1o2zbYmyfLSK2bExVWKoZBYMSP0ZCnFOIWK8SMLHA3b1ycN7p35kiQf8gZDZD'},
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