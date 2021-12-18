const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const ejs = require('ejs');
const bodyParser = require("body-parser");
const {check, validationResult} = require("express-validator");
const { urlencoded } = require("body-parser");
const app = express();
app.set("view engine","ejs");

const urlencodedParser = bodyParser.urlencoded({extended:false});


app.use(express.static("public"));
app.use('/images',express.static('images'));
app.get('/js/signup.js',function(req,res){
    res.sendFile(path.join(__dirname + 'public/js/signup.js')); 
});


mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
const userSchema = {
    email : String,
    password : String
}

const User = new mongoose.model("User", userSchema);



app.get("/",function(req,res){  
    res.render('index',{foo:'FOO'})
})
app.get("/signup",function(req,res){
    res.render('signup');   
})
app.get("/login",function(req,res){
    res.render('login');
})

app.post("/signup",urlencodedParser,[
    check('username','This username must be longer then 3 characters!')
    .exists()
    .isLength({min:3}),
    check('email','This is not a valid email')
    .isEmail()
    .normalizeEmail()
],(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        //return res.status(422).jsonp(errors.array());
        res.render('login');
        
    }
        else{
            
            res.status(500).json(errors);
        }
    
    const newUser = new User({
        email: req.body.username,
        password: req.body.password

    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        } else{
            res.render("login");
        }
    });
});

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err);
        } else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("index",{islogin:true,uname:username});
                    console.log(username);
                }
            }
        }

    })
})
app.listen(3000,function(){
    console.log("Server started on port 3000")
});

