const express=require('express');
const fetch=require('node-fetch');
require("dotenv").config();



const app=express();


const PORT=process.env.PORT || 3000;


app.set("view engine","ejs");
app.use(express.static("public"));

app.use(express.urlencoded({extended:true}))

app.use(express.json());

app.get("/",(req,res)=>{
    res.render("index");
})

app.post("/convert-mp3", async(req,res)=>{

    const videoID=req.body.videoID;
    if(videoID===undefined ||
        videoID==="" ||
        videoID=== null){
            return res.render("index",{success:false , message:"Please enter a videoID"});
        }else{

            const fetchAPI= await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`,{
                "method":"GET",
                "headers":{
                    "x-rapidapi-key": process.env.API_KEY,
		"x-rapidapi-host": process.env.API_HOST
                }
            });

            const fetchResponse=await fetchAPI.json();

            if(fetchResponse.status==="ok")
                return res.render("index",{success:true, song_title: fetchResponse.title, song_link:fetchResponse.link});
            else
            return res.render("index",{success:false, message:fetchResponse.msg})

    }
    })
     




app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`);
})



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    <title>Youtube to MP3</title>
</head>
<body>

    <div class="top-container">
        <form action="/convert-mp3" method="POST" id="form">
            <h1><i class="fa-brands fa-youtube"></i>Youtube to MP3 Converter</h1>
            <h4>Enter URL</h4>
            <div>
                <input type="text" name="videoID" placeholder="ID">
                <button id="convert-btn">Convert</button>
            </div>
        </form>
    </div>

    <div class="bottom-container">
        <% if(typeof success != "undefined" && success){ %>
        <div class="success">
            <p><%=song_title %></p>
            <a href="<%=song_link %>"><button id="download-btn">DONWLOAD</button></a>
        </div>
        <%} else if(typeof success!="undefined" && !success){ %>
        <div class="errors">
            <p><%=message%></p>
        </div>
        
       <% } %>
        
        
    </div>
    
</body>
</html>