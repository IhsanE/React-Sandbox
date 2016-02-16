// modules =================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongojs = require("mongojs");
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
    fs = require('fs-extra');

// configuration ===========================================

// database config
var databaseUrl = 'mongodb://127.0.0.1:27017/todo';

var port = process.env.PORT || 3000; // set our port
// mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)


app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({
    extended: true
})); // parse application/x-www-form-urlencoded
// cleaning functions ======================================

exports.taskFormat = function (task){
    return ('id' in task && 'txt' in task && Object.keys(task).length == 2);
}

// database functions ======================================


//Mark tasks as completed
var db_mark_task = function(key) {
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) {
            callback(false);
        } else {
            db.collection("tasks").updateOne({
               "id": key
           },
           {
               $set: {'type':'completed'}
           });
        }
    });
}

//Get TODO tasks
var db_get_completed = function(callback) {
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) {
            callback(false);
        } else {
            db.collection("tasks").find({
                "type": "completed"
            }).toArray(function(err, docs) {
                db.close();
                callback(docs);
            });
        }
    });
}

//Get COMPLETED tasks
var db_get_todo = function(callback) {
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) {
            callback(false);
        } else {
            db.collection("tasks").find({
                "type": "task"
            }).toArray(function(err, docs) {
                db.close();
                callback(docs);
            });
        }
    });
}


// Remove user by email
var db_remove = function(key, callback) {

    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) {
            callback(false);
        } else {
            db.collection("tasks").remove({
                "id": key
            }, function(err, docs) {
                db.close();
                callback(true);
            });
        }
    });
}


var db_insert = function(key, txt) {
    MongoClient.connect(databaseUrl, function(err, db) {
        db.collection("tasks").insert({
            "id": key,
            "txt": txt,
            "type":"task"
        }, function(err, docs) {
            //console.log(err);
            //console.log("something happened");
            db.close();

        });

    });
}

// Delete task
app.post('/deleteTask', function(req, res) {
    var data = req.body;
    var key = req.body.key;
    //console.log(key);
    db_remove(key, function(status) {
        if (status) {
            res.status(200).send({
                data: "success"
            });
        } else {
            res.status(403).send({
                data: "failure"
            });
        }
    });

});

// Get the list of users in db
app.get('/UserList', function(req, res) {
    db_get_all(req.session.email, function(data) {
        if (data) {
            res.status(200).send(data);
        } else {
            res.status(403).send({
                data: "failure"
            });
        }
    });
});

app.post('/moveToCompleted',function(req, res) {
    db_mark_task(req.body.key);
    res.send({data:true});
});

app.post('/insertTask',function(req, res) {
    db_insert(req.body.key, req.body.txt);
    res.send({data:true});
});

app.get('/getCompletedTasks',function(req, res) {
    // Reset the session email, logged in status, and type
    db_get_completed(function(data) {
        if (data) {
            res.status(200).send(data);
        } else {
            res.status(200).send({
                data: []
            });
        }
    });
});

app.get('/getTODOTasks',  function(req, res) {
    db_get_todo(function(data) {
        if (data) {
            res.status(200).send(data);
        } else {
            res.status(403).send({
                data: "failure"
            });
        }
    });
});

app.get('/index.html', function(req, res) {
    res.sendfile('./index.html');
});

app.get('/style.css', function(req, res) {
    res.sendfile('./style.css');
});

// Serves main index.html file, based on user type (admin/super/normal)
app.get('/', function(req, res) {
    res.sendfile('./index.html');
});

// start app ===============================================
app.listen(port);
//console.log('Server started on port: ' + port); // shoutout to the user
