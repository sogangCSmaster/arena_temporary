const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
require('express-async-errors');
const session = require('express-session');
const MYSQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const config = require('./config.json');
const port = 80;

app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
app.use(bodyParser.json({ extended: true, limit: '30mb' }));

app.use(session({
    secret: 'asasdhjfdkjheasdfkdkflsk',
    resave: false,
    saveUninitialized: false,
    store: new MYSQLStore({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database
    })
}))


app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

app.use((req,res,next) => {
    res.locals.session = req.session;
    next();
});

const datakey = require('./routes/datakey');
app.use(datakey);




app.get('*', (req, res, next) => {
    res.status(404).send('404 Error');
    // res.render('comingsoon/index');
});
app.get('*', (err, req, res, next) => {
    console.error(err);
    res.status(500).send('500 Error');
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});