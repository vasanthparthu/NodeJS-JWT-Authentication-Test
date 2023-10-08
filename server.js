const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');

const {expressjwt: expressJwt} = require('express-jwt');

const path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers','Content-type,Aythorization');
    next();
});

const PORT = 3000;
const secretkey = 'My super secret key';
const jwtMW = expressJwt({
    secret: secretkey,
    algorithms: ['HS256']
});

let users = [
    {
        id:1,
        username:'Vasanth',
        password:'2310'
    },
    {
        id:2,
        username:'Parthu',
        password:'0219'
    }
];

app.post('/api/login', (req,res) => {
    const {username, password} = req.body;
    
    for(let user of users) {
        if(username == user.username && password == user.password) {
            let token = jwt.sign({id : user.id , username : user.username},secretkey,{expiresIn :'3m'});
            res.json({
                success: true,
                err: null,
                token: token
            });
            break;
        }
        else {
            res.status(401).json({
                success: false,
                token: null,
                err: 'username or password is incorrect !!!'

            });
        }
    }
    
});

app.get('/api/dashboard', jwtMW , (req,res) => {
    console.log(req);
    res.json({
        success: true,
        myContent:'Secret content that only logged in people can see.'
    });
});

app.get('/api/prices', jwtMW , (req,res) => {
    console.log(req);
    res.json({
        success: true,
        myContent:'This is the price $3.99'
    });
});

app.get('/api/settings', jwtMW , (req,res) => {
    console.log(req);
    res.json({
        success: true,
        myContent:'This is the settings page'
    });
});
 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'));

});

app.use(function(err, req, res, next) {
    if(err.name ==='UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Username or password is incorrect 2'
        });
    }
    else {
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`);
});