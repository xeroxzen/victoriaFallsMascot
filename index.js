//Author: Andile Jade Mbele
//Purpose: nodejs webhook for victoria falls mascot
"use strict";

const express = require("express");
const app = express();
// const dfff = require("dialogflow-fulfillment");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");
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

app.post("/conversations", express.json(), (req, res) => {
  const agent = new WebhookClient({
    request: req,
    response: res,
  });

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
    var complaint = agent.context.get("complaint").parameters.complaint;
    agent.add("Thank you for your invaluable input.");

    // save to db
    return db
      .collection("Diagnosis")
      .add({
        complaint: complaint,
      })
      .then(
        (ref) =>
          // fetching free slots
          console.log("Saved to DB")
        // agent("Take care!.")
      );
  }

  function recommendation(agent) {
    agent.add("What is your recommendation?");
  }

  function saveRecommendation(agent) {
    var recommendation = agent.context.get("recommendation").parameters
      .recommendation;
    agent.add("Thank you for your invaluable recommendation");

    // save to db
    return db
      .collection("Diagnosis")
      .add({
        recommendation: recommendation,
      })
      .then(
        (ref) =>
          // fetching free slots
          console.log("Saved to DB")
        // agent("Take care!.")
      );
  }

  //   function coronavirusCountryYes(agent) {
  //     agent.add("Which country did you visit?");
  //   }

  //   function coronavirusCountryNo(agent) {
  //     agent.add(
  //       "Have you come in contact with someone who later tested positive for COVID-19?"
  //     );
  //   }

  //   function coronavirusCountryNoGetPhone(agent) {
  //     agent.add(
  //       "May we have your phone number so our Rapid Response Team can contact you immediately."
  //     );
  //   }

  //   function coronavirusCountryNoGetPhone2(agent) {
  //     agent.add(
  //       "May we have your phone number so our Rapid Response Team can contact you immediately."
  //     );
  //   }

  function rapidResponse(agent) {
    agent.add(
      "Thank you for your cooperation. \n\nIn the meantime we advise you to remain at home in self-isolation. Our Rapid Response Team will contact you shortly."
    );
  }

  function saveToDB(agent) {
    //we need to save some data here
    // data to be saved
    // age range, gender, symptoms, phone number, time
    let parameters = req.body;

    var ageRange = agent.context.get("covidGender").parameters["ageGroups"];
    var gender = agent.context.get("covidSymptoms").parameters["gender"];
    var symptoms = agent.context.get("coronavirusPhone-followup").parameters[
      "symptoms"
    ];
    var phone = agent.context.get("capture-phone-number").parameters["phone"];

    // human readable date
    // const dateObject = new Date();

    agent.add(
      "Thank you for your cooperation. \n\nIn the meantime we advise you to remain at home in self-isolation. Our Rapid Response Team will contact you shortly."
    );

    // save to db
    return db
      .collection("Diagnosis")
      .add({
        age: ageRange,
        sex: gender,
        symptoms: symptoms,
        phone: phone,
      })
      .then(
        (ref) =>
          // fetching free slots
          console.log("Saved to DB"),
        agent("Take care!.")
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
  intentMap.set("rapidResponse", rapidResponse);
  intentMap.set("improveServiceDelivery - Complaint", lodgeComplaint);
  intentMap.set("improveServiceDelivery - Recommendation", recommendation);
  intentMap.set("saveComplaint", saveComplaint);
  intentMap.set("saveRecommendation", saveRecommendation);
  // intentMap.set("rapidResponse", saveToDB);
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
