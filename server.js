const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

let db, collection
const url = 'mongodb+srv://user:pass@cluster0.cy9xnyv.mongodb.net/?retryWrites=true&w=majority'
const dbName = 'tv_shows'

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if (error) throw error
        db = client.db(dbName)
        console.log(`Connected to "${dbName}."`)
    })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
    db.collection('ratings').find()
    .toArray((err, data) => {
        if (err) return console.log(err)
        res.render('index.ejs', { data })
    })
})

app.post('/show', (req, res) => {
    console.log(req)
    db.collection('ratings').insertOne({
        show: req.body.show,
        rating: 0
    },
    (err, data) => {
        if (err) return console.log(err)
        console.log('Saved to database')
        res.redirect('/')
    })
})

app.put('/show/rating', (req, res) => {
    db.collection('ratings').updateOne({ 
        show: req.body.show 
    },
    { $set: { rating: parseInt(req.body.rating) } },
    (err, data) => {
        if (err) return res.send(err)
        res.send(data)
    })
})

app.delete('/show', (req, res) => {
    db.collection('ratings').findOneAndDelete({
        show: req.body.show
    },
    (err, data) => {
        if (err) return res.send(500, err)
        res.send('Message deleted')
    })
})