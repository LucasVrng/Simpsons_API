require ('dotenv').config()

const express = require("express");
const app = express();
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

app.use(express.json());

const posts = [ 
  { 
    username : "Homer",
    title : "shar sucks"
  },
  {
    username: "Marge",
    title: "life sucks"
  }
]

app.get("/posts", authToken, (req,res) => {
  res.json(posts.filter(post => post.username === req.user.username))
})

const users = []

function authToken(req,res,next) {
  const authHeader = req.headers['authorization']
  const token = authHeader &&  authHeader.split(' ')[1]
  if (token==null) return res.status(401).send()

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user ) => {
      if (err) return res.status(403).send()
        req.user = user
      next()
    })
}


app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
