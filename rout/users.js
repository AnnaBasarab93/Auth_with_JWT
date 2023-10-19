import express from 'express';
const userRouter = express.Router();
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const secret = process.env.SECRET_TOKEN;
const generateToken = (data) => {
    return jwt.sign(data, secret, {expiresIn: '1800s'});
    }

/*
//TO GET/login without  NoSQL
userRouter.get ('/login', (req, res) => {
try{
    res.send (`<form action="/api/jwt/connect" method="post">
    <label>Login username:</label>
    <input type="text" placeholder="Enter Username" name="username" required>
    </br>
    </br>
    <label>Password : </label>   
    <input type="password" placeholder="Enter Password" name="password" required>  
    </br>
    </br>
    <input type='submit' value='Submit'>
    </form>`)
}catch(err){
    res.status(500).json(err)
}
});

//POST /connect: without  NoSQL
userRouter.post('/connect', (req, res)=>{
    const {username, password} = req.body;
try{
if(username === 'John' && password === 'doe'){
    const generateToken = (data) => {
        return jwt.sign(data, secret, {expiresIn: '1800s'});
        }
    const token = generateToken({username: 'John'});
    console.log(token)
    res.set('Access-Control-Allow-Headers', token)
    res.send (
        `<h3>Check Token:</h3>
        <form action="/api/jwt/checkJWT" method="post">
        <label>Token:</label>
        <input type="text" placeholder="Enter Token" name="token" required>
        </br>
        </br>
        <input type='submit' value='Submit'>
        </form>`
    )
}else{
        res.redirect('/api/jwt/login')
    }
}catch(err){
        res.status(500).json(err)
}
})

//POST /checkJWT: without  NoSQL
userRouter.post ('/checkJWT', (req, res) => { 
try{
    const {token} = req.body;
        jwt.verify(token, secret, (err, decoded) => {
if(err) {
        res.redirect('/api/jwt/login');
        } 
        console.log(decoded)
        res.redirect('/api/jwt/admin');
        
    } )
}catch{
    res.status(500).json(err);
}
})

userRouter.get('/admin', (req, res) => { 
try{
    res.send (`<h2>You are verified successfully </h2>`);

}catch(err){
    res.status(500).json(err)
}
});
*/

//NOSQL

//Get all Users
userRouter.get('/', async(req, res) =>{
    try{
        const response = await User.find();
        res.json(response);
    }catch(err){
        res.status(500).json(err)
    }
})

//Login User
userRouter.get ('/login', async(req, res) => {
    try{
        res.send (`<form action="/api/jwt/connect" method="post">
        <label>Login username:</label>
        <input type="text" placeholder="Enter Username" name="username" required>
        </br>
        </br>
        <label>Password : </label>   
        <input type="password" placeholder="Enter Password" name="password" required>  
        </br>
        </br>
        <input type='submit' value='Submit'>
        </form>`)
    }catch(err){
        res.status(500).json(err)
    }
    });

//Create a User in a database
userRouter.post('/register', async (req, res) =>{
    const {username, password} = req.body;
try{
    const hashedPassword = await bcrypt.hash(password, 10);
        //console.log(hashedPassword)
    const response = await User.create({username, password: hashedPassword});
      //  console.log(response);
        res.status(201).json(response);
        
    } catch(err){
        return res.status(500).json(err)
    }
});

//Log in User

userRouter.post('/connect', async (req, res) => {
    const {username, password} = req.body;
    try{
        const user = await User.findOne({username});
       // console.log(user)
        if(!user){
            res.status(400).send("User didn't find");
        }
        const comparePassword= await bcrypt.compare(password, user.password)
        if(!comparePassword){
            res.redirect('/api/jwt/login');
        }
        const token = generateToken({username: user.username});
        console.log(token)
        res.set('Access-Control-Allow-Headers', token)
        res.send (
            `<h3>Check Token:</h3>
            <form action="/api/jwt/checkJWT" method="post">
            <label>Token:</label>
            <input type="text" placeholder="Enter Token" name="token" required>
            </br>
            </br>
            <input type='submit' value='Submit'>
            </form>`
        )
    }catch(err){
        res.status(500).json(err)
    }
})

//Verify Token
userRouter.post ('/checkJWT', (req, res) => { 
    try{
        const {token} = req.body;
            jwt.verify(token, secret, (err, decoded) => {
    if(err) {
            res.redirect('/api/jwt/login');
            } 
            console.log(decoded)
            res.redirect('/api/jwt/admin');
        })
    }catch{
        res.status(500).json(err);
    }
    })
    
    userRouter.get('/admin', (req, res) => { 
    try{
        res.json ({'message': 'Verified successfully'});
    
    }catch(err){
        res.status(500).json(err)
    }
    });

export default userRouter;
