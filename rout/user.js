import express from 'express';
const userRouter = express.Router();
import jwt, { decode } from 'jsonwebtoken';


const secret = process.env.SECRET_TOKEN;

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


export default userRouter;
