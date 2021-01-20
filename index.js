//Author: Andile Jade Mbele
//Purpose: nodejs webhook for victoria falls mascot

const express = require("express");
const app = express();
const dialogflow = require("dialogflow-fulfillment");

//security credentials
const admin = require("firebase-admin");
