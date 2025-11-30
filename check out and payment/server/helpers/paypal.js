const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AWihJHl1m71T6NST84uKcrGixoxX7lvpiGNOXFTtNWIid74Qy3ensXZfsimWV2ZQ8Gwj5xbqX-uYASr0",
  client_secret: "EIBynshtENAF_neGP0aucITdGlwE6acyxxnkxLb-KTEXv977qoUwxH7Yx25xPL90dYysUZRAtwtUeEsG",
});

module.exports = paypal;
