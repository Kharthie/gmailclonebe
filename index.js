import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import sendMail from "./models/send.mail.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import users from "./models/user.model.js";
import nodemailer from "nodemailer";


const app = express();
app.use(express.json());

app.use(cors());


const connection__url =
  "mongodb+srv://user1:12345@cluster0.c6r2o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const secret = "ZQy788RYIh";

mongoose.connect(connection__url);


app.get("/", (req, res) => res.status(200).send("hello world"));


app.post("/clone", (req, res) => {
  const bodyvalue = req.body;

  
  sendMail.create(bodyvalue, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});


app.post("/mail", (req, res) => {
  console.log(req.body);
  sendMail.find(req.body, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});


app.post("/singlemail", (req, res) => {
  console.log(req.body);
  sendMail.findOne(req.body, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});


app.post("/register", (req, res) => {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.password, salt);
  req.body.password = hash;
  const bodyvalue = req.body;
  console.log(bodyvalue);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "person605205@gmail.com",
      pass: "Hello@123",
    },
  });
 

  let mailoption = {
    from: "person605205@gmail.com",
    to: req.body.email,
    subject: "Successfully Register,This is a Test Email from gmail clone.",
    text: `Hello there  ${req.body.firstname} . Please click SignIn button & enter your mail-Id and Password.`,
  };

  transporter.sendMail(mailoption, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email Send !!!!!");
    }
  });
  users.create(bodyvalue, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});



app.post("/login", async (req, res) => {
  try {
    let user = await users.findOne({ email: req.body.email });
    if (user) {
      let passwordresult = await bcrypt.compare(
        req.body.password,
        user.password
      );
      console.log(passwordresult);
      if (passwordresult) {
        let token = jwt.sign({ userid: user._id }, secret, { expiresIn: "1d" });
        res.json({ token });
      } else {
        res.status(401).json({ message: "Invalid Password" });
      }
    } else {
      res.status(401).json({ message: "Invalid user" });
    }
  } catch (error) {
    console.log(error);
  }
});


let authenticate = (req, res, next) => {
  if (req.headers.authentication) {
    try {
      let result = jwt.verify(req.headers.authentication, secret);
      next();
    } catch (error) {
      res.status(401).json({ message: "Token Expired" });
    }
  } else {
    res.status(401).json({ message: "Not Authorized" });
  }
};


app.get("/main", authenticate, (req, res) => {
  res.json({ mesaagae: 20 });
});


app.get("/viewall", (req, res) => {
  var bodyvalue = req.body;
  users.find(bodyvalue, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    } 
  });
});


const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server Running on Localhost:${port} ✅✅✅✅✅✅✅`));