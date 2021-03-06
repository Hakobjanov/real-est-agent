http = require("http");
const requestHandler = (req, resp) => {
  require("./requestHandler")(req, resp);
  delete require.cache[require.resolve("./requestHandler")];
};
http.createServer(requestHandler).listen(process.env.PORT || 3001);
