const express = require("express");
const { sendRes } = require("../helper/helper");
// const userModel = require("../models/userModels");
const userModel = require("../models/userModel");
const route = express.Router();
const bcrypt = require("bcryptjs");

route.get("/signup", async (req, res) => {
  const { userName, email, password } = req.body;
  const obj = { userName, email, password };
  let requiredArr = ["userName", "email", "password"];
  let errArr = [];

  requiredArr.forEach((x) => {
    if (!obj[x]) {
      errArr.push(x);
    }
  });

  if (errArr.length > 0) {
    res.send(sendRes(false, null, "Some feilds missing", errArr)).status(400);
  } else {
    let hashPassword = await bcrypt.hash(obj.password, 10);
    console.log(hashPassword);
    obj.password = hashPassword;
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      res.send(sendRes(false, null, "email is already in use")).status(403);
    } else {
      userModel
        .create(obj)
        .then((result) => {
          console.log(result);
          res.send(sendRes(true, result, "data saved")).status(200);
        })
        .catch((err) => {
          res.send(sendRes(false, null, "internal server errror")).status(400);
        });
    }
  }
});

route.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const obj = { email, password };

  userModel
    .findOne({ email })
    .then(async(user) => {
      let isConfirm = await bcrypt.compare(obj.password, user.password);
      console.log(isConfirm);
      if(!isConfirm){
        res.send(sendRes(false,null,'credential error'))
      }else{
          res.send(sendRes(true, user, 'login successfully'));
      }
    })
    .catch((err) => {
      res.send(sendRes(false, err, 'internal server error'));
    });
});

route.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const obj = { email, password };

  userModel.findOne({ email })
    .then(async (user) => {
      console.log(user);
      let isConfirm = await bcrypt.compare(obj.password, user.password);
      console.log(isConfirm);
      if (isConfirm) {
        res.send(sendRes(true, user, "Login Successfully"));
      } else {
        res.send(sendRes(false, null, "Credential Error"));
      }
    })
    .catch((err) => {
      res.send(sendRes(false, err, "User Doesn't Exist"));
    });
});

route.post("/");
route.post("/");
route.put("/");
route.delete("/");

module.exports = route;
