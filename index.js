//Author: Andile Jaden Mbele
//Purpose: nodejs webhook for victoria falls mascot
"use strict";

const express = require("express");
const app = express();
const { Paynow } = require("paynow");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");
const { uuid } = require("uuidv4");

//security credentials
var admin = require("firebase-admin");

var serviceAccount = require("./config/victoriafallsmascot-imwo-firebase-adminsdk-2hs88-562506bac3.json");

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://victoriafallsmascot-imwo.firebaseio.com",
  });

  console.log("Connected to Database");
} catch (err) {
  console.log(`Error here ${err}`);
}

var db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

// let's define a port we could use
const port = process.env.PORT || 3000;
process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements
process.unhandledRejections = "strict";

app.get("/", (req, res) => {
  res.send("yup, the server is live.");
});

app.post("/conversations", express.json(), (request, response) => {
  const agent = new WebhookClient({ request: request, response: response });

  // function to test if it works
  function webhookDemo(agent) {
    // agent.add("Server is live. Congrats");
    agent.add(`We are live from port ${port}. Congrats`);
    console.log(`Live from port ${port}`);
  }

  // Many Cancel functions
  function coronavirusInfoCancel(agent) {
    agent.add(
      "Goodbye, see you next time. To start a new conversation, type 'Hi'"
    );
  }

  function coronavirusProtectionCancel(agent) {
    agent.add(
      "Goodbye, see you next time. To start a new conversation, type 'Hi'"
    );
  }

  function coronavirusUpdatesCancel(agent) {
    agent.add(
      "Goodbye, see you next time. To start a new conversation, type 'Hi'"
    );
  }

  function coronavirusHelpCancel(agent) {
    agent.add(
      "Goodbye, see you next time. To start a new conversation, type 'Hi'"
    );
  }

  function askQuestion(agent) {
    agent.add(
      "Hello there. Sorry this function is not available yet.We'll let you know as soon as it is available."
    );
  }

  function disclaimerNo(agent) {
    agent.add("Good bye");
  }

  function coronavirusPhone(agent) {
    agent.add(
      "May we have your phone number so our Rapid Response Team can contact you immediately. \nExample: 0789488124"
    );
  }

  function lodgeComplaint(agent) {
    agent.add("What is your complaint?");
  }

  function saveComplaint(agent) {
    var complaint = agent.parameters.complaint;
    var complaintsDate = new Date();

    //save the id
    var id = uuid();

    // agent.add("Thank you for your invaluable input.");
    // save to db
    return db
      .collection("Complaints")
      .add({
        id: id,
        complaint: complaint,
        date: complaintsDate,
      })
      .then(
        (ref) =>
          // fetching free slots
          console.log("Saved to DB"),
        agent.add("Thank you for you invaluable input.")
      );
  }

  function recommendation(agent) {
    agent.add("What is your recommendation?");
  }

  function saveRecommendation(agent) {
    var id = uuid();
    var recommendation = agent.parameters.recommendation;
    var recommendationDate = new Date();

    // save to db
    return db
      .collection("Recommendation")
      .add({
        id: id,
        recommendation: recommendation,
        date: recommendationDate,
      })
      .then(
        (ref) =>
          // fetching free slots
          console.log("Saved to DB"),
        agent.add("Thank you for your invaluable recommendation"),
        agent.add("Take care!.")
      );
  }

  function saveToDB(agent) {
    // Simpler format
    const age = agent.parameters["ageGroups"];
    const gender = agent.parameters["gender"];
    const symptoms = agent.parameters["symptoms"];
    const phone = agent.parameters["phone"];

    //get the id
    const id = uuid();
    //let's get the time
    const time = new Date();

    //testing
    console.log(
      `Age: ${age} \nSex: ${gender} \nSymptom: ${symptoms} \nTime: ${time}`
    );

    // save to db
    return db
      .collection("userDiagnosis")
      .add({
        id: id,
        age: age,
        gender: gender,
        symptoms: symptoms,
        phone: phone,
        time: time,
      })
      .then(
        (ref) =>
          // fetching free slots
          console.log("Saved to DB"),
        // agent.add("Our Rapid Response Team will contact you shortly"),
        agent.add(
          "Thank you for your cooperation. \n\nIn the meantime we advise you to remain at home in self-isolation. Our Rapid Response Team will contact you shortly"
        ),
        agent.add(new Suggestion(`Hello again`)),
        agent.add(new Suggestion(`Bye for now`))
      );
  }

  //Payments

  function getPaymentsAccountNumber(agent) {
    agent.add(
      "Welcome to the payments portal. \n\nTo proceed with your rates payment, may we have your House Account Number \n\nFormat: 32003000"
    );
  }

  function getPaymentsPhone(agent) {
    agent.add("May we have your phone number? \n\nFormat +263779545334");
  }

  function getPaymentsEmail(agent) {
    agent.add("May we have your email address?");
  }

  function getPaymentsAccount(agent) {
    agent.add("May we have your mobile money number eg 07XXXXXXXX");
  }

  function getPaymentsAmount(agent) {
    agent.add("Amount to be paid in ZWL e.g 500.90");
  }

  function generateInvoiceNumber() {
    //invoice number format INV-yymmdd-count INV-20210218-009
    //get date
    const date = new Date();
    const dateString = formatDate(date);
    var lastNumber = 0;

    //var newNumber = (lastNumber + 1).toString();
    var newNumber = (Math.floor(Math.random() * 1000) + 1).toString();
    newNumber.length == 1 && (newNumber = "0" + newNumber);
    newNumber.length == 2 && (newNumber = "0" + newNumber);

    return "INV-" + dateString + "-" + newNumber;
  }

  function formatDate(date) {
    let str = "";
    var y = date.getFullYear().toString();
    var m = (date.getMonth() + 1).toString();
    var d = date.getDate().toString();

    d.length == 1 && (d = "0" + d);
    m.length == 1 && (m = "0" + m);

    str = y + m + d;
    return str;
  }

  function processPayment(agent) {
    //generate a new invoice number
    const invoiceNumber = generateInvoiceNumber();
    const accountNumber = agent.parameters.accountNumber;
    const phone = agent.parameters["phone-number"];
    const phoneAccount = agent.parameters.phoneAccount;
    const paymentOption = agent.parameters.paymentOption;
    const amount = agent.parameters.amount;
    const email = agent.parameters.email;
    const date = new Date();

    var paynow_id = process.env.INTEGRATION_ID;
    var paynow_key = process.env.INTEGRATION_KEY;

    let paynow = new Paynow(paynow_id, paynow_key);
    let payment = paynow.createPayment(invoiceNumber, email);
    payment.add("Rates", amount);
    paynow
      .sendMobile(payment, accountNumber, paymentOption)
      .then(function (response) {
        if (response.success) {
          agent.add(
            "You have successfully paid $" +
              amount.amount +
              ". Your invoice number is " +
              invoiceNumber
          );
          var paynowReference = response.pollUrl;
          //save the id
          var id = uuid();

          // save to db
          return db
            .collection("Rates")
            .add({
              id: id,
              invoiceNumber: invoiceNumber,
              accountNumber: accountNumber,
              phone: phone,
              phoneAccount: phoneAccount,
              paymentOption: paymentOption,
              amount: amount,
              paynowReference: paynowReference,
              email: email,
              date: date,
            })
            .then((ref) => console.log("Success"));
        } else {
          agent.add("Whoops something went wrong!");
          console.log(response.error);
        }
      })
      .catch((error) => {
        agent.add("Whoops something went wrong!");
        console.log("Something is really wrong", error);
      });
  }

  // let's setup intentMaps
  var intentMap = new Map();
  intentMap.set("webhookDemo", webhookDemo);
  intentMap.set("coronavirusInfoCancel", coronavirusInfoCancel);
  intentMap.set("coronavirusProtectionCancel", coronavirusProtectionCancel);
  intentMap.set("coronavirusUpdatesCancel", coronavirusUpdatesCancel);
  intentMap.set("coronavirusHelpCancel", coronavirusHelpCancel);
  intentMap.set("askQuestion", askQuestion);
  intentMap.set("disclaimerNo", disclaimerNo);
  intentMap.set("coronavirusPhone", coronavirusPhone);

  intentMap.set("saveToDB", saveToDB);
  intentMap.set("improveServiceDelivery - Complaint", lodgeComplaint);
  intentMap.set("improveServiceDelivery - Recommendation", recommendation);
  intentMap.set("saveComplaint", saveComplaint);
  intentMap.set("saveRecommendation", saveRecommendation);

  intentMap.set("payments", getPaymentsAccountNumber);
  intentMap.set("getPaymentsPhone", getPaymentsPhone);
  intentMap.set("getPaymentsAmount", getPaymentsAmount);
  intentMap.set("getPaymentsAccount", getPaymentsAccount);
  intentMap.set("getPaymentsEmail", getPaymentsEmail);
  // intentMap.set("getPaymentsConfirmation", getPaymentsConfirmation);
  intentMap.set("processPayment", processPayment);

  // intentmap request handling
  agent.handleRequest(intentMap);
});

// let's listen
app.listen(port, () => {
  console.log(`Server is live at port ${port}`);
  console.log(`Press Ctrl + C to abort the connection.`);
});
