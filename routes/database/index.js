const mysql = require('mysql');
const config = require('../../config.json')

var connection = mysql.createPool({
    connectionLimit: 5,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

module.exports = connection;