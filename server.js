//0c6439742e82c79ffb2c8a90d67
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var request = require('request');

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.set('view engine', 'ejs')

var port = process.env.PORT || 8080;

const MongoClient = require('mongodb').MongoClient

const TextRazor = require('textrazor')
const textRazor = new TextRazor('<key>');

//const options = { extractors: 'topics'}

var db;
/////////////////////////////////////
MongoClient.connect('mongodb://nickcm:<password>@ds139969.mlab.com:39969/stories-database', (err, client) => {
        if (err) return console.log(err);
        db = client.db('stories-database');
        var server = http.listen(port,() => {
            //console.log('server is listening on port', server.address().port)
         })

         app.get('/stories-list', (req, res) => {
            var cursor = db.collection('stories').find()
        
            db.collection('stories').find().toArray(function(err, results) {
                
                res.render('index.ejs', {stories: results})
                //console.log(results.length);
            })
            
        })
})

console.log("the web app is running!");

app.get('/hello', (req,res) =>{
    res.send("hello world!!")
})

app.post('/story', (req, res) => {
    //var content = '';
    var options = { extractors: 'topics'}
    var content = req.body.textArea;
    
    var topicsArray = [];
    textRazor.exec(req.body.textArea, options)
        .then(res => {
            console.log(req.body.textArea);
            console.log(res.response);
            for(i = 0; i < res.response.topics.length; i++){
                if(res.response.topics[i].score >= 0.6){
                    //console.log(res.response.topics[i]);
                    //console.log(res.response.topics[i].label);
                    topicsArray.push(res.response.topics[i].label);
                    //console.log(res.response.topics[i].label);
                }
            }
            //console.log(topicsArray);

            var thisDocument = {story: content, topics: topicsArray};
    

            db.collection('stories').save(thisDocument, (err, result) => {
                if (err) return console.log(err)
        
                console.log('saved to database')
                //res.redirect('/')
            })
        })
        
            //console.log(res.response.topics))
        .catch(err => console.error(err))

    res.redirect('/')
})

//522a586b8d5a2ead8996902556f43