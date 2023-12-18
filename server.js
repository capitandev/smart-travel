var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var connection = mysql.createConnection({
    host     : 'database-1.cunvjswgqb43.ap-northeast-2.rds.amazonaws.com',
    user     : 'new_admin',
    password : 'web2023qaz',
    database : 'webproject'
});

var app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function restrict(req, res, next) {
    if (req.session.loggedin) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.sendFile(path.join(__dirname, '/my/index.html'));
    }
}

app.use('/', function(request, response, next) {
    if (request.session.loggedin || request.url === "/login" || request.url === "/register") {
        next();
    } else {
        response.sendFile(path.join(__dirname, '/my/login.html'));
    }
});

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '/my/home.html'));
});

app.get('/login', function(request, response) {
    response.sendFile(path.join(__dirname, '/my/login.html'));
});

app.post('/login', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    
    if (username && password) {
        connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (error) throw error;

            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home');
            } else {
                response.sendFile(path.join(__dirname, '/my/loginerror.html'));
            }
        });
    } else {
        response.send('Please enter Username and Password!');
    }
});

app.get('/register', function(request, response) {
    response.sendFile(path.join(__dirname, '/my/register.html'));
});

app.post('/register', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    var email = request.body.email;
    
    console.log(username, password, email);

    if (username && password && email) {
        connection.query('SELECT * FROM user WHERE username = ? AND password = ? AND email = ?', [username, password, email], function(error, results, fields) {
            if (error) throw error;

            if (results.length <= 0) {
                connection.query('INSERT INTO user (username, password, email) VALUES (?, ?, ?)', [username, password, email],
                    function (error, data) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(data);
                            response.send('<script>alert("' + username + ' Registered Successfully!"); setTimeout(function() { window.location.href = "/home"; }, 2000);</script>');
                        }
                });
            } else {
                response.send(username + ' Already exists!<br><a href="/home">Home</a>');
            }
        });
    } else {
        response.send('Please enter User Information!');
    }
});

app.get('/logout', function(request, response) {
    request.session.loggedin = false;
    response.send('<center><H1>Logged Out.</H1><H1><a href="/">Goto Home</a></H1></center>');
});

app.get('/home', restrict, function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname, '/my/home.html'));
    } else {
        response.send('Please login to view this page!');
    }
});

app.get('/test2', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname, '/my/test2.html'));
    } else {
        response.send('Please login to view this page!');
    }
});

// Board
app.get('/board', function (request, response) { 
    fs.readFile(path.join(__dirname, '/board/list.html'), 'utf8', function (error, data) {
        connection.query('SELECT * FROM products', function (error, results) {
            response.send(ejs.render(data, { data: results }));
        });
    });
});

app.get('/delete/:id', function (request, response) { 
    connection.query('DELETE FROM products WHERE id=?', [request.params.id], function () {
        response.redirect('/board');
    });
});

app.get('/insert', function (request, response) {	
    fs.readFile(path.join(__dirname, '/board/insert.html'), 'utf8', function (error, data) {
        response.send(data);
    });
});

app.post('/insert', function (request, response) {
    var body = request.body;

    connection.query('INSERT INTO products (name, modelnumber, series) VALUES (?, ?, ?)', [
        body.name, body.modelnumber, body.series
    ], function () {
        response.redirect('/board');
    });
});

app.get('/edit/:id', function (request, response) {
    fs.readFile(path.join(__dirname, '/board/edit.html'), 'utf8', function (error, data) {
        connection.query('SELECT * FROM products WHERE id = ?', [
            request.params.id
        ], function (error, result) {
            response.send(ejs.render(data, { data: result[0] }));
        });
    });
});

app.post('/edit/:id', function (request, response) {
    var body = request.body

    connection.query('UPDATE products SET name=?, modelnumber=?, series=? WHERE id=?', [
        body.name, body.modelnumber, body.series, request.params.id
    ], function () {
        response.redirect('/board');
    });
});

app.listen(3000, function () {
    console.log('Server Running at http://127.0.0.1:3000');
});
