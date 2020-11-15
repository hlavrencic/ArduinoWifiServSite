define(["wifiserv", "axios"], (wifiservDummy, axios) => {
  return {
    post(uri, data) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let random;
          switch (uri) {
            case "getScan":
              random = Math.round(Math.random() * 4);
              switch (random) {
                case 1:
                  resolve({
                    code: 200,
                    data: {
                      scan: [{ ssid: "NETWORK_1" }, { ssid: "NETWORK_2" }]
                    }
                  });
                  break;
                default:
                  resolve({});
              }

              break;
            case "startScan":
              resolve({ code: 200 });
              break;
            case "connect":
              if (data.ssid == "NETWORK_1" && data.password == "1234") {
                resolve();
                setTimeout(() => {
                  wifiservDummy.received({
                    code: 200,
                    data: { wifiStatus: "CONNECTING" }
                  });
                }, 1000);

                setTimeout(() => {
                  wifiservDummy.received({
                    code: 200,
                    data: { wifiStatus: "CONNECTED" }
                  });
                }, 5000);
              } else if (data.ssid == "NETWORK_2" && data.password == "1234") {
                resolve({ code: 200 });
              } else {
                reject("CLAVE INCORRECTA");
              }

            case "wifiStatus":
              random = Math.round(Math.random() * 4);
              switch (random) {
                case 1:
                  axios.post("lib/dmy/" + uri).then(resolve);

                  break;
                case 2:
                  resolve({
                    code: 200,
                    data: { wifiStatus: "CONNECTING", ssid: "NETWORK_1" }
                  });
                  break;
                case 3:
                  resolve({
                    code: 200,
                    data: {
                      wifiStatus: "ERROR",
                      reason: 8,
                      ssid: "NETWORK_1"
                    }
                  });
                  break;
                default:
                  resolve({ code: 400 });
              }

              break;
            default:
              resolve({ code: 404 });
          }
        }, 1000);
      });
    }
  };
});
