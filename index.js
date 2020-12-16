const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require('mongodb').MongoClient;
const objectID = require('mongodb').ObjectID;
require('dotenv').config()

const port = 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zkovl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


client.connect(err => {

    const experiencesCollection = client.db("AirCnC").collection("Experiences");
    const homesCollection = client.db("AirCnC").collection("Homes");

    app.get('/experiences', (req, res) => {
        experiencesCollection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })

    app.get('/homes', (req, res) => {
        homesCollection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })

    app.get('/details/:id', (req, res) => {
        const id = parseInt(req.params.id);
        homesCollection.find({ id: id })
            .toArray((err, document) => {
                res.send(document)
            })
    })


    app.get('/search/:key', (req, res) => {
        homesCollection.createIndex({ location: 'text', guest: "text" })
        homesCollection.find(
            { $text: { $search: req.params.key } }
        )
            .toArray((err, document) => {
                res.send(document)
            })
    })


    console.log("Database connected");
});



app.listen(process.env.PORT || port);