const express = require('express');
const customerRouter = require('./router/customer')
const app = express()
const path = require('path');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');




// EXPRESS RELATED 
app.use('/static', express.static('static'))
app.use(express.urlencoded({ extended: false }))
app.use('/customers', customerRouter)




// EJS RELATED
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));


// MONGO RELATED 
mongoose.connect('mongodb+srv://tbank-admin:tbankadmin@cluster0.xmvbw.mongodb.net/Bank_DataBase', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we're connected!");
});









// ENDPOINTS
app.get('/', (req, res) => {
    res.status(200).render("home.ejs")

});







// START LIVE SERVER
let port = process.env.PORT;
if (port == null || port == "") {
    port = 80;
}

app.listen(port, () => {
    console.log(`website running on port ${port}`);
});