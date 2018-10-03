const apps = require("./apps");
const admin = require("./admin");
const { login } = require("./login");
const sheets = require("./sheets");

module.exports = app => {
  app.use("/apps", apps);
  app.use("/admin", admin);
  app.use("/login", login);
  app.use("/sheets", sheets);
};
