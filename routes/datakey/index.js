const express = require('express');
const router = express.Router();
const query = require('../query');
const axios = require('axios');
const moment = require('moment');
moment.locale('ko');

router.route("/datakey")
    .get(async(req, res, next) => {
        var { datakey } = req.query;
        if(datakey){
            req.session.datakey = datakey;
            console.warn(req.session);
            res.send(datakey);
            var sql = "INSERT IGNORE INTO arena (datakey, createdAt) VALUES (?, ?)";
            var now = moment().format('YYYY-MM-DD HH:mm:ss');
            query.executeSQL(sql, [datakey, now]);
        } else {
            return res.send('no datakey');
        }
    })
    .post(async(req, res, next) => {
        var { datakey } = req.session;
        if(datakey){
            var url = "https://api.flexplatform.net//v1/reward_common.php?datakey="+datakey
            axios.get(url)
                .then((response) => {
                    var data = response.data;
                    data = JSON.parse(data);
                    var return_code = data.return_code;

                    if(return_code=="0000"){
                        var sql = "UPDATE arena SET loginSucceedAt=? WHERE datakey=?";
                        var now = moment().format('YYYY-MM-DD HH:mm:ss');
                        query.executeSQL(sql, [now, datakey]);
                    }
                    
                    return res.send(data);
                })
        } else {
            return res.send('no datakey');
        }
    })

module.exports = router;