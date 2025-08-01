const express=require("express");
const app=express();
const {exec}=require("child_process");
app.use(express.json());
app.use(express.static(__dirname));
app.use(express.urlencoded({extended:true}));
app.listen(2000,()=>{
    console.log("server started sucessfully");
})


const mongoose=require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/dockerclients")
const db=mongoose.connection

 db.once('open',()=>{
    console.log("mongodb connection sucessful");
 })
app.use(express.static(__dirname));
app.use(express.urlencoded({extended:true}))

app.get("/form",(req,res)=>{
    res.sendFile(__dirname+"/form.html");
 })


        


app.get("/run",(req,res)=>{
    const cname=req.query.cname;
    const cimage=req.query.cimage;
  const customerSchema = new mongoose.Schema({
    cname:String,
    cimage:String
});

const customers=mongoose.models.customers||mongoose.model('customers',customerSchema);
module.exports=customers;
   const user=  new customers({
      cname,
      cimage
   })
    user.save();
   console.log(customers);
   
    exec('docker run -dit --name '+cname+" "+cimage,(err,stdout,stderr)=>{
      console.log(stdout);
      res.send("container created");
  })
  
});
app.get("/ps",(req,res)=>{
    exec('docker ps -a ',(err,stdout,stderr)=>{
       console.log(stdout);
       res.send("<pre>"+stdout+"</pre>");
    })
})
  
app.get("/run2",(req,res)=>{
    const n=req.query.n;
    exec('docker start '+n,(err,stdout,stderr)=>{
      console.log(stdout);
      res.send("container started");
    })
})
app.get("/run3",(req,res)=>{
    const n1=req.query.n1;
    exec('docker stop '+n1,(err,stdout,stderr)=>{
      console.log(stdout);
      res.send("container stopped");
    })
})
app.get("/run4",(req,res)=>{
    const n2=req.query.n2;
    exec('docker container rm -f '+n2,(err,stdout,stderr)=>{
      console.log(stdout);
      res.send("container removed");
    })
})

