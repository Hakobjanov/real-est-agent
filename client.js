const http = require("http");
const https = require("https");

const postData = JSON.stringify({
  msg: "Привет Мир!",
});

options = {
  hostname: "www.google.com",
  port: 80,
  path: "/upload",
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": Buffer.byteLength(postData),
  },
};

const data = {
  company: "choiceandpoint",
  access_key: "choiceandpoint-7G8*zMr#",
  access_password:
    "SsK3k71FZ&F7VE&mzKDGZl7#BVG@BqTGQOb7UI^f9Fu8Vx@^EDIKjG%b7aQR6B^Y",
  version: "1.1",
  //   deal: "rent_long",
  //   property: "flat",
  //   //   prop_kind: "isolated",
  //   country_id: "Ukraine",
  region_id: "Київська область",
  locality_id: "Київ",
  //   geo_search_by: "city",
};

options = {
  //   host: "re.plektan.com",
  //   path: "/ru/API_serp/search",
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  //body: JSON.stringify(data),
};

options2 = {
  method: "POST",
  host: "localhost",
  port: "3001",
  path: "/api",
  headers: {
    //"Content-Type": "application/x-www-form-urlencoded",
    //"Content-Length": Buffer.byteLength(postData),
  },
};

const req = http
  .request("http://re.plektan.com/ru/API_geo/getDistricts", options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding("utf8");
    res.on("data", (chunk) => {
      console.log(`BODY: ${decodeURIComponent(chunk)}`);
    });
    res.on("end", () => {
      console.log("No more data in response.");
    });
  })
  .end(qString(data));

// req.on("error", (e) => {
//   console.error(`problem with request: ${e.message}`);
// });
const qStringData = qString(data);

// Write data to request body
console.log(qStringData);
// req.write(qStringData);
// req.end();

function qString(obj) {
  return Object.entries(obj)
    .map((keyValue) => keyValue.map((str) => encodeURIComponent(str)).join("="))
    .join("&");
}
