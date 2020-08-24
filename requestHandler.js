const fs = require("fs"),
  fsp = fs.promises;

const utf = "; charset=utf-8";

const typeDict = {
  html: "text/html" + utf,
  htm: "text/html" + utf,
  json: "application/json" + utf,
  css: "text/css" + utf,
  txt: "text/plain" + utf,
  ico: "image/x-icon",
  jpg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  svg: "image/svg+xml" + utf,
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  js: "application/javascript" + utf,
};

module.exports = function requestHandler(request, response) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const reqParams = {
    company: "choiceandpoint",
    access_key: "choiceandpoint-7G8*zMr#",
    access_password:
      "SsK3k71FZ&F7VE&mzKDGZl7#BVG@BqTGQOb7UI^f9Fu8Vx@^EDIKjG%b7aQR6B^Y",
    version: "1.1",
  };

  const url = "http://re.plektan.com/ru/";

  //debugger;
  if (request.url === "/") {
    fsp.readFile("public/index.html").then((file) => response.end(file));
  } else if (request.url === "/districts") {
    const params = {
      ...reqParams,
      region_id: "Київська область",
      locality_id: "Київ",
    };

    http
      .request(url + "API_geo/getDistricts", options, (res) =>
        res.pipe(response)
      )
      .end(qString(params));
  } else if (request.url === "/region") {
    const params = {
      ...reqParams,
      country_id: "Ukraine",
      region_id: "Київська область",
    };

    http
      .request(url + "API_geo/getRegion", options, (res) => res.pipe(response))
      .end(qString(params));
  } else if (request.url === "/subway") {
    const params = {
      ...reqParams,
      region_id: "Київська область",
      locality_id: "Київ",
    };

    http
      .request(url + "API_geo/getSubway", options, (res) => res.pipe(response))
      .end(qString(params));
  } else if (request.url === "/view") {
    const params = {
      ...reqParams,
      adid: "RF-1-592-003",
      currency_id: "uah",
    };

    http
      .request(url + "API_view/view", options, (res) => res.pipe(response))
      .end(qString(params));
  } else if (request.url === "/api/search") {
    streamToString(request).then((json) => {
      const { street, district, rooms } = JSON.parse(json);

      const params = {
        ...reqParams,

        deal: "rent_long",
        property: "flat",
        prop_kind: ["isolated"],
        country_id: "Ukraine",
        region_id: "Київська область",
        locality_id: "Київ",
      };

      let conditionFn;
      if (street && district) {
        conditionFn = (lot) =>
          street
            .toLowerCase()
            .split(" ")
            .some(
              (word) =>
                lot.street.toLowerCase().includes(word) &&
                lot.district.toLowerCase().includes(district.toLowerCase())
            );
      } else if (district) {
        conditionFn = (lot) =>
          lot.district.toLowerCase().includes(district.toLowerCase());
      } else if (street) {
        conditionFn = (lot) =>
          street
            .toLowerCase()
            .split(" ")
            .some((word) => lot.street.toLowerCase().includes(word));
      } else if (1) {
      } else {
        conditionFn = () => true;
      }

      http
        .request(url + "API_serp/search", options, (res) => {
          streamToString(res).then((json) => {
            const cardsHtml = JSON.parse(json)
              .data.filter(conditionFn)
              .map(buildCardHtml)
              .join("");

            response.end(
              cardsHtml ||
                "<div style='margin: auto'>Объектов по данным параметрам не найдено</div>"
            );
          });
        })
        .end(qString(params));
    });
  } else if (request.url === "/search") {
    const params = {
      ...reqParams,
      // "sorter[field]": "price",
      // "sorter[direction]": "desc",
      // deal: "by_number",
      // regnumber: "RF-1-592-003",
      // show_all: "1",
      deal: "rent_long",
      property: "flat",
      prop_kind: ["isolated"],
      // geo_search_by: "region",
      country_id: "Ukraine",
      region_id: "Київська область",
      locality_id: "Київ",
      // repair: ["evro"],
    };

    http
      .request(url + "API_serp/search", options, (res) => res.pipe(response))
      .end(qString(params));
  } else if (request.url === "/rental/index.html") {
    const params = {
      ...reqParams,
      deal: "rent_long",
      property: "flat",
      prop_kind: ["isolated"],
      country_id: "Ukraine",
      region_id: "Київська область",
      locality_id: "Київ",
    };

    http
      .request(url + "API_serp/search", options, (res) => {
        streamToString(res).then((json) => {
          const cardsHtml = JSON.parse(json).data.map(buildCardHtml).join("");
          fsp
            .readFile("public/rental/index.html")
            .then((file) =>
              response.end(
                file
                  .toString()
                  .replace(/(<ul class="cards">)/, "$1" + cardsHtml)
              )
            );
        });
      })
      .end(qString(params));
    //.catch((err) => response.end("PAGE NOT FOUND!"));
  } else {
    fsp
      .readFile("public" + request.url)
      .then((file) => {
        const match = request.url.match(/\.(\w+)$/);
        const ext = match ? match[1] : "html";
        response.setHeader("Content-Type", typeDict[ext]);
        response.end(file);
      })
      .catch((err) => response.end("PAGE NOT FOUND!"));
  }
};

function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

function qString(obj) {
  return Object.entries(obj)
    .map((keyValue) => keyValue.map((str) => encodeURIComponent(str)).join("="))
    .join("&");
}

function buildCardHtml(lot) {
  return `
    <li class="card">
      <div class="lot-photo"><img src="${lot.media.src_small}" alt="" /> </div>  
      <div class="lot-address"> Адрес: ${lot.street}</div>
      <div class="lot-info">
        <p> Район: ${lot.district}</p>
        <p> Цена: ${lot.price.value_obj}</p>
        <p> Общая площадь: ${lot.area_total}</p>
        <p> Количество комнат: ${lot.room_count}</p>
        <p> Этаж: ${lot.storey}</p>
      </div>
    </li>     
  `;
}
