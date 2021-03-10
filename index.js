//Author: Andile Jaden Mbele
//Purpose: nodejs webhook for victoria falls mascot
//https://victoria-falls-mascot.herokuapp.com/conversations
"use strict";

const express = require("express");
const app = express();
const { Paynow } = require("paynow");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");
const { uuid } = require("uuidv4");
require("dotenv").config();

//security credentials
var admin = require("firebase-admin");
var paynow_id = process.env.INTEGRATION_ID;
var paynow_key = process.env.INTEGRATION_KEY;

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
    // const age = agent.parameters["ageGroups"];
    // const gender = agent.parameters["gender"];
    // const symptoms = agent.parameters["symptoms"];
    // const phone = agent.parameters["phone"];

    // the older way
    const ageGrp = agent.context.get("coronavirusGender-followup").parameters
      .ageGroups;
    const sex = agent.context.get("coronavirusSymptoms-followup").parameters
      .gender;
    const symptom = agent.context.get("coronavirusPhone-followup").parameters
      .symptoms;
    const cellNumber = agent.context.get("confirmDetails-followup").parameters
      .phone;

    //get the id
    const id = uuid();
    //let's get the time
    const time = new Date();

    //testing
    // console.log(
    //   `Age: ${age} \nSex: ${gender} Phone: ${phone} \nSymptom: ${symptoms} \nTime: ${time}`
    // );

    console.log(
      `Age: ${ageGrp} \nSex: ${sex} \nPhone: ${cellNumber} \nSymptom: ${symptom} \nTime: ${time}`
    );

    // save to db
    return db
      .collection("userDiagnosis")
      .add({
        id: id,
        // age: age,
        // gender: gender,
        // symptoms: symptoms,
        // phone: phone,
        // time: time,
        // old formatDate
        ageGrp: ageGrp,
        sex: sex,
        symptom: symptom,
        cellNumber: cellNumber,
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
        agent.add(new Suggestion(`Bye for now`)),
        agent.end("")
      );
  }

  //Payments

  function generateInvoiceNumber() {
    //invoice number format INV-yymmdd-count INV-20210218-009
    //get date
    const date = new Date();
    const dateString = formatDate(date);

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

  function getPaymentsAccountNumber(agent) {
    agent.add(
      "Welcome to the payments portal. \n\nTo proceed with your rates payment, may we have your House Account Number \n\nFormat: 32003000"
    );
    agent.end("");
  }

  function getPaymentsPhone(agent) {
    agent.add("May we have your phone number? \n\nFormat 0779545334");
    agent.end("");
  }

  function getPaymentsEmail(agent) {
    agent.add("May we have your email address? \n\nExample: vfm@example.com");
    agent.end("");
  }

  function getPaymentsAccount(agent) {
    agent.add("May we have your mobile money number eg 07XXXXXXXX");

    // return phoneAccount;
  }

  function getPaymentsOption(agent) {
    /*
    agent.context.set({
      'name':'backend-captured-email',
      'lifespan': 5,
      'parameters':{
        'email':agent.query
        }
    });
    */
    agent.add("Which payment method would you like to use?");
    agent.add(new Suggestion("ecocash"));
    agent.add(new Suggestion("onemoney"));
    agent.add(new Suggestion("telecash"));
    agent.end("");
  }

  function getPaymentsAmount(agent) {
    agent.add("Amount to be paid in ZWL e.g 500.90");
    agent.end("");
  }

  // --unhandled-rejections=strict

// <<<<<<< paymentsHack
//     str = y + m + d;
//     return str;
//   }

  async function checkPaymentStatus(agent){
    const pollUrl = agent.context.get("capture_payment_status_information").parameters.pollUrl;
    const amount = agent.context.get("capture_payment_status_information").parameters.amount;
    const invoiceNumber = agent.context.get("capture_payment_status_information").parameters.invoiceNumber;
    let paynow = new Paynow(paynow_id, paynow_key);
    let response = await paynow.pollTransaction(pollUrl);
    let status = await response.status;
    if (status==='paid' || status=='awaiting delivery' || status=='delivered') {
      agent.add(
        "You have successfully paid $" +
          amount.amount +
          ". Your invoice number is " +
          invoiceNumber + "."
      );
    } else {
      if (status == 'cancelled' || status=='refunded' || status=='disputed'){
        agent.add("Rate payment transaction successfully cancelled!");
      }
      else if(status == 'sent' || status=='pending' || status=='created')
        agent.add("You have not completed you payment!");
        //set_checkPaymentStatus(agent, stage+1, pollUrl);
    }
  }

  async function processPayment(agent) {
    //generate a new invoice number
    const invoiceNumber = generateInvoiceNumber();
    const accountNumber = agent.context.get("payment-followup").parameters
      .accountNumber;
    const phone = agent.context.get("paymentphone").parameters["phone-number"];
    const phoneAccount = agent.context.get("getpaymentsaccount-followup")
      .parameters.phoneAccount;
    const paymentOption = agent.context.get("getpaymentsoption-followup")
      .parameters.paymentOption;
    const amount = agent.context.get("getpaymentsamount-followup").parameters
      .amount;
    const email = agent.context.get("getpaymentsemail-followup").parameters
      .email;

    //save the id
    const id = uuid();
    const date = new Date();

    let paynow = new Paynow(paynow_id, paynow_key);
    // Testing
    console.log(
      `Invoice Number: ${invoiceNumber} \nHouse Account #: ${accountNumber} \nPhone: ${phone} \nPayment Account: ${phoneAccount} \nPayment Option: ${paymentOption} \nAmount: $${amount.amount} \nEmail: ${email}`
    );

//     let paynow = new Paynow("11734", "0586e460-df4b-409b-948b-940c0fd485fb");

    //Set return and return urls
    paynow.resultUrl = "http://example.com/gateways/paynow/update";
    paynow.returnUrl =
      "http://example.com/return?gateway=paynow&merchantReference=1234";

    // create a new payment
    let payment = paynow.createPayment(invoiceNumber, email);

    // let account = accountNumber;
    // let option = paymentOption;

    payment.add("Rates", parseFloat(amount.amount));

    response = await paynow.sendMobile(payment, phoneAccount, paymentOption.toLowerCase());
    if (response.success) {

      var paynowReference = response.pollUrl;
      agent.add("A popup will appear, enter your pn number to complete the payment. After making your payment, click CHECK PAYMENT STATUS");
      agent.add(new Suggestion("Check payment status"));
      /*agent.add(
        "You have successfully paid $" +
          amount.amount +
          ". Your invoice number is " +
          invoiceNumber + ". The paynow reference is " + paynowReference
      );*/

      agent.context.set('capture_payment_status_information',5,{
            "pollUrl": paynowReference, 
            "invoiceNumber": invoiceNumber,
            "amount": amount
      });
      /*
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
        .then((ref) => console.log("Success"));*/
    } else {
      agent.add("Whoops something went wrong!");
      console.log(response.error);
    }
// =======
    paynow
      .sendMobile(payment, phoneAccount, paymentOption)
      .then((response) => {
        if (response.success) {
          // These are the instructions to show the user.
          // Instruction for how the user can make a payment
          // Get the link to redirect the user to, then use it as you see fit
          let link = response.redirectUrl;

          let instructions = response.instructions;

          console.log(instructions);
          // pollUrl for the transaction
          let paynowReference = response.pollUrl;

          //Telegram Output
          agent.add(
            "You have successfully paid $" +
              amount.amount +
              ". Your invoice number is " +
              invoiceNumber +
              ". The paynow reference is " +
              paynowReference
          );

          //save
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
            .then((ref) => console.log("Transaction successful"));
        } else {
          agent.add("Whoops something went wrong!");
          console.log(response.error);
        }
      })
      .catch((ex) => {
        console.log("Something didn't go quite right", ex);
      });
// >>>>>>> main
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
  intentMap.set("getPaymentsOption", getPaymentsOption);
  // intentMap.set("getPaymentsConfirmation", getPaymentsConfirmation);
  intentMap.set("processPayment", processPayment);
  intentMap.set("checkPaymentStatus", checkPaymentStatus);

  // intentmap request handling
  agent.handleRequest(intentMap);
});

// let's listen
app.listen(port, () => {
  console.log(`Server is live at port ${port}`);
  console.log(`Press Ctrl + C to abort the connection.`);
});
