//Author: Andile Jade Mbele
//Purpose: nodejs webhook for victoria falls mascot

const express = require("express");
const app = express();
const dialogflow = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");

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

app.get("/", (req, res) => {
  res.send("yup, the server is live.");
});

app.post("/conversations", express.json(), (req, res) => {
  const agent = new dialogflow.WebhookClient({
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
      "May we have your phone number so our Rapid Response Team can contact you immediately."
    );
  }

  //   function coronavirusCountry(agent) {
  //     agent.add("Did you visit any country in the last 7 days?");
  //   }

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

  //   function coronavirusContactNotSure(agent) {
  //     agent.add(
  //       "May we have your phone number so our Rapid Response Team can contact you immediately."
  //     );
  //   }

  // let's setup intentMaps
  var intentMap = new Map();
  intentMap.set("webhookDemo", webhookDemo);
  intentMap.set("coronavirusInfoCancel", coronavirusInfoCancel);
  intentMap.set("coronavirusProtectionCancel", coronavirusProtectionCancel);
  intentMap.set("coronavirusUpdatesCancel", coronavirusUpdatesCancel);
  intentMap.set("coronavirusHelpCancel", coronavirusHelpCancel);
  intentMap.set("disclaimerNo", disclaimerNo);
    intentMap.set("coronavirusPhone", coronavirusPhone);
  intentMap.set("coronavirusCountryYes", coronavirusCountryYes);
  //   intentMap.set("coronavirusCountryNo", coronavirusCountryNo);
  intentMap.set("coronavirusCountryNo - yes", coronavirusCountryNoGetPhone);
  //   intentMap.set("coronavirusCountryNo - no", coronavirusCountryNoGetPhone2);
  //   intentMap.set("coronavirusCountryNo - custom", coronavirusContactNotSure);
  intentMap.set("coronavirusCountryYes - next", coronavirusCountryYesNext);

  // intentmap request handling
  agent.handleRequest(intentMap);
});

// let's listen
app.listen(port, () => {
  console.log(`Server is live at port ${port}`);
  console.log(`Press Ctrl + C to abort the connection.`);
});
