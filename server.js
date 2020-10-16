const PORT=process.env.PORT||9000
const express=require("express")
const app=express();
const bodyparser=require("body-parser")
app.use(bodyparser.json())
const mongodb=require("mongodb")
const mongoClient=mongodb.MongoClient;
const url="mongodb+srv://vishnu:123abc@cluster0.o2tjj.mongodb.net/loginreact?retryWrites=true&w=majority";
const cors=require("cors")
const nodemailer=require("nodemailer")
app.use(cors({
    origin:'*'
}))

app.post("/register",async function(req,res){
   
   try{
    let client=await mongodb.MongoClient.connect(url,{useUnifiedTopology:true})
    let db=client.db("loginreact")
    await db.collection("users").insertOne({_id:req.body.userid,password:req.body.password})
    client.close
    res.json({
        message:"Success"
    })
}catch(err){
    res.json(err)
}
})

app.get("/login",async function(req,res){

try{
    let client=await mongodb.MongoClient.connect(url,{useUnifiedTopology:true})
    let db=client.db("loginreact")
    let obj=await db.collection("users").findOne({_id:req.body.userid})
    client.close
    if(obj)
    res.json(obj)
    else
    res.json({
        message:"user not found"
    })
}catch(err){
    res.json(err)
}
})

app.get("/all",async function(req,res){

    try{
        let client=await mongodb.MongoClient.connect(url,{useUnifiedTopology:true})
        let db=client.db("loginreact")
        let arr=await db.collection("users").find().toArray()
        client.close
        console.log(arr)
        res.json(arr)
    }catch(err){
        res.json(err)
    }
    })

    app.post("/forget",async function(req,res){
   
        try{
         let rand=""+Math.floor((Math.random()*1000000)+1);   
         let client=await mongodb.MongoClient.connect(url,{useUnifiedTopology:true})
         let db=client.db("loginreact")
         await db.collection("users").findOneAndUpdate({_id:req.body.userid},{$set:{_id:req.body.userid,password:rand}})

         client.close
         var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'bitlyappexe@gmail.com',
              pass: 'QWE123rty'
            }
          });
          console.log(transporter)
          var mailOptions = {
            from: 'bitlyappexe@gmail.com',
            to:req.body.email,
            subject: 'Password reset authentication',
            text:`${rand}`
          };
          
         transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              res.json({
                message:"Mail sent",
                random:`${rand}`
            
              })
            }
          });
         
     }catch(err){
         res.json(err)
     }
     })
     app.listen(PORT, () => console.log(`server running on ${PORT}`));