const express =require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection =require("./config.js")
 const app= express();
 //convert to json
 app.use(express.json());
 app.use(express.urlencoded({extended:false}))
const Port =3000;

//use Ejs as the view Engine
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.get("/",(req,res)=>{
   res.render("login")
});
app.get("/signup",(req,res)=>{
   res.render("signup")
})
//Register 
app.post("/signup",async(req,res)=>{
   const data={
      name:req.body.username,
      password:req.body.password
   }

   //Existing User method 
   const ExistUser =await collection.findOne({name: data.name});
   if(ExistUser){
      res.send("User already Exists ,Please Enter the another name");
   }
    else{
     const saltRounds = 10;
     const hashedPassword = await bcrypt.hash(data.password,saltRounds);
     data.password =hashedPassword;//replace the password with the hashpassword

   const userData = await collection.insertMany(data);
    console.log(userData);
    }
})


app.post("/login",async(req,res)=>{
    try{
      const check = await collection.findOne({name:req.body.username});
      if(!check){
         res.send("User can't found");
      }
   
      //compare the bcrypt password
      const isPasswordMatch = await bcrypt.compare(req.body.password,check.password);
      if(isPasswordMatch){
         res.render("homes");
      }else{
         req.send("wrong Password");
      }
   
    } catch{
      res.send("Wrong details");
    }

})
 app.listen(Port,()=>{
    console.log("Server is running on this Port" + Port);
 })