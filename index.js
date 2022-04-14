require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
// DB Connection
mongoose.connect(process.env.DB_CONNECTION, {
 useNewUrlParser: true,
 useUnifiedTopology: true
}, (err) => {
 if (err) console.log(err);
 else console.log('successfully connected to db');
})
// Tells expresss that our view engine is ejs
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

// Home page
app.get('/', async (req, res) => {
 const shortUrls = await ShortUrl.find();
 console.log(shortUrls);
 res.render('index', {
  shortUrls: shortUrls
 })
});
// Post new Links to create shortUrl
app.post('/shortUrls', async (req, res) => {
 await ShortUrl.create({ full: req.body.fullUrl })
 res.redirect('/')
});

// Use Short url to redirect to actual link
app.get('/:shortUrl', async (req, res) => {
 const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
 if (shortUrl == null)
  return res.sendStatus(404)

 shortUrl.clicks++;
 await ShortUrl.updateOne({
  _id: shortUrl._id,
 }, {
  $set: {
   clicks: shortUrl.clicks
  }
 })
 res.redirect(shortUrl.full);
})

app.listen(process.env.PORT || 5000, () => console.log("Server started at port 5000"));