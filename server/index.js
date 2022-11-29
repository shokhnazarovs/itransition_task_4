require('dotenv').config({path: './config.env'});
const path = require('path');
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Users = require('./models/Users');
const cookieParser = require('cookie-parser');

mongoose.connect(process.env.MONGO_KEY, {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // For legacy browser support
}
const jwtOptions = {
    secure: true,
    httpOnly: true
}

const authenticate = async (req, res, next) => {  
    try {
        const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const user = await Users.findOne({ _id: decodedToken._id });

        if(!user){
            throw new Error();
        } else if(user.status === 'blocked'){
            res.sendStatus(403);
            return;
        }

        next();
        
    } catch (e) {
        if(req.url === '/login' || req.url === '/register') {
            next();
            return;
        }  
        res.sendStatus(401);
    }
};

app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(authenticate);

var port = process.env.PORT || 3001;
var server = app.listen(port, () => {
    console.log('app is listening to port 3001');
});

app.post('/login-data', cors(corsOptions), async (req, res)=>{
    const user = await Users.findOne({email: req.body.email, password: req.body.password});
    if(user){
        await Users.updateOne({email: req.body.email}, {logtime: new Date()});
        const token = jwt.sign({_id: user.id}, process.env.JWT_SECRET);
        res.cookie('jwt', token, jwtOptions);
        res.send();
    } else {
        res.sendStatus(401);
    }
});

app.post('/register', cors(corsOptions), async (req, res)=>{
    const user = await Users.findOne({email: req.body.email});

    if(user){
        res.sendStatus(409);
        return;
    }
    
    Users.create({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: req.body.password,
        regtime: new Date(),
        logtime: new Date(),
        status: 'active'
    }, (err, doc)=>{ 
        if(err){
            res.sendStatus(406);
        } else {
            const token = jwt.sign({_id: doc.id}, process.env.JWT_SECRET);
            res.cookie('jwt', token, jwtOptions);
            res.send();
        }
    });
});

app.get('/data', cors(corsOptions), async (req, res)=>{
    const allUsers = await Users.find({}, {password: 0}).lean();
    res.send(allUsers);
});

app.post('/update', cors(corsOptions), async (req, res)=>{
    try{
        if(req.body.action === 'block'){
            await Users.updateMany({ _id: {$in: req.body.data}}, {status: 'blocked'});
        } else if(req.body.action === 'unblock'){
            await Users.updateMany({ _id: {$in: req.body.data}}, {status: 'active'});
        } else if(req.body.action === 'delete'){
            await Users.deleteMany({ _id: {$in: req.body.data}});
        }
    } catch {
        res.sendStatus(400);
    }

    const allUsers = await Users.find({}, {password: 0}).lean();
    res.send(allUsers);
})

app.get('/logout', (req, res)=>{
    res.cookie('jwt', 'logged-out', jwtOptions)
    
    res.sendStatus(200);
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });