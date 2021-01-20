//Author: Andile Jade Mbele
//Purpose: nodejs webhook for victoria falls mascot

const express = require("express");
const app = express();
const dialogflow = require("dialogflow-fulfillment");

//security credentials
var admin = require("firebase-admin");

var serviceAccount = require("./config/victoriafallsmascot-imwo-firebase-adminsdk-2hs88-562506bac3.json");
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("Connected to Database");
} catch (err) {
  console.log(`Error here ${err}`);
}
