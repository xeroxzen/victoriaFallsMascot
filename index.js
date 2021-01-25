//Author: Andile Jade Mbele
//Purpose: nodejs webhook for victoria falls mascot
"use strict";

const express = require("express");
const app = express();
// const dfff = require("dialogflow-fulfillment");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Title, Card, Suggestion } = require("dialogflow-fulfillment");
// const DialogflowApp = require("actions-on-google").DialogflowApp;

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

  //parameters
  // let parameters = agent.request.body;

  // function to test if it works
  function webhookDemo(agent) {
    // agent.add("Server is live. Congrats");
    agent.add(`We are live from port ${port}. Congrats`);
    console.log(`Live from port ${port}`);
  }

  // Many Cancel functions
  function coronavirusInfoCancel(agent) {
    agent.add("Goodbye, see you next time.");
  }

  function coronavirusProtectionCancel(agent) {
    agent.add("Goodbye, see you next time.");
  }

  function coronavirusUpdatesCancel(agent) {
    agent.add("Goodbye, see you next time.");
  }

  function coronavirusHelpCancel(agent) {
    agent.add("Goodbye, see you next time.");
  }

  function disclaimerNo(agent) {
    agent.add("Good bye");
  }

  function coronavirusPhone(agent) {
    agent.add(
      "May we have your phone number so our Rapid Response Team can contact you immediately. \nExample: 0789488124"
    );
  }

  function confirmDetailsCancel(agent) {
    agent.add("Good bye! Have yourself a good day.");
  }

  function lodgeComplaint(agent) {
    agent.add("What is your complaint?");
  }

  function saveComplaint(agent) {
    // var complaint = agent.context.get("saveComplaint").parameters.complaint;
    var complaint = agent.parameters.complaint;
    agent.add("Thank you for your invaluable input.");

    var date = new Date();

    // save to db
    return db
      .collection("Complaints")
      .add({
        complaint: complaint,
        date: date,
      })
      .then(
        (ref) =>
          // fetching free slots
          console.log("Saved to DB")
        // agent.add("Take care!.")
      );
  }

  function recommendation(agent) {
    agent.add("What is your recommendation?");
  }

  function saveRecommendation(agent) {
    // var recommendation = agent.context.get("saveRecommendation").parameters.recommendation;
    var recommendation = agent.parameters.recommendation;

    var date = new Date();
    agent.add("Thank you for your invaluable recommendation");

    // save to db
    return db
      .collection("Recommendation")
      .add({
        recommendation: recommendation,
        date: date,
      })
      .then(
        (ref) =>
          // fetching free slots
          console.log("Saved to DB")
        // agent.add("Take care!.")
      );
  }

  function saveToDB(agent) {
    //we need to save some data here
    // data to be saved
    // age range, gender, symptoms, phone number, time

    // Simpler format
    var ageRange = agent.parameters.ageGroups;
    var gender = agent.parameters.gender;
    var symptoms = agent.parameters.symptoms;
    var phone = agent.parameters.phone;

    //let's get the time
    const time = new Date();

    agent.add(
      "Thank you for your cooperation. \n\nIn the meantime we advise you to remain at home in self-isolation. Our Rapid Response Team will contact you shortly"
    );

    // save to db
    return db
      .collection("userDiagnosis")
      .add({
        ageRange: ageRange,
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
        agent.add(new title("Where to next?")),
        agent.add(new Suggestion(`More`)),
        agent.add(new Suggestion(`Bye for now`))
      );
  }

  // let's setup intentMaps
  var intentMap = new Map();
  intentMap.set("webhookDemo", webhookDemo);
  intentMap.set("coronavirusInfoCancel", coronavirusInfoCancel);
  intentMap.set("coronavirusProtectionCancel", coronavirusProtectionCancel);
  intentMap.set("coronavirusUpdatesCancel", coronavirusUpdatesCancel);
  intentMap.set("coronavirusHelpCancel", coronavirusHelpCancel);
  intentMap.set("disclaimerNo", disclaimerNo);
  intentMap.set("coronavirusPhone", coronavirusPhone);
  intentMap.set("confirmDetailsCancel", confirmDetailsCancel);
  // intentMap.set("rapidResponse", rapidResponse);
  intentMap.set("rapidResponse", saveToDB);
  intentMap.set("improveServiceDelivery - Complaint", lodgeComplaint);
  intentMap.set("improveServiceDelivery - Recommendation", recommendation);
  intentMap.set("saveComplaint", saveComplaint);
  intentMap.set("saveRecommendation", saveRecommendation);
  //   intentMap.set("coronavirusCountryNo - yes", coronavirusCountryNoGetPhone);
  //   intentMap.set("coronavirusCountryNo - no", coronavirusCountryNoGetPhone2);
  //   intentMap.set("coronavirusCountryNo - custom", coronavirusContactNotSure);
  //   intentMap.set("coronavirusCountryYes - next", coronavirusCountryYesNext);

  // intentmap request handling
  agent.handleRequest(intentMap);
});

// let's listen
app.listen(port, () => {
  console.log(`Server is live at port ${port}`);
  console.log(`Press Ctrl + C to abort the connection.`);
});
