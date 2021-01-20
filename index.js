//Author: Andile Jade Mbele
//Purpose: nodejs webhook for victoria falls mascot

const express = require("express");
const app = express();
const dialogflow = require("dialogflow-fulfillment");

//security credentials
var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");
try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("Connected to Database");
} catch (err) {
    console.log(`Error here ${err}`)
}


