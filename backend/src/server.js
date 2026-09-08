const { Temporal } = require("@js-temporal/polyfill");
globalThis.Temporal = Temporal;

const app = require("./app");

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`FlowOps server running on http://${HOST}:${PORT}`);
});