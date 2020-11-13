define(["wifiserv"], wifiservDummy => {
  return {
    post(uri, data) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          switch (uri) {
            case "scan":
              resolve({ scan: [{ ssid: "NETWORK_1" }, { ssid: "NETWORK_2" }] });
              break;
            case "connect":
              if (data.ssid == "NETWORK_1" && data.password == "1234") {
                resolve();
                setTimeout(() => {
                  wifiservDummy.received({ wifiStatus: "CONNECTING" });
                }, 1000);

                setTimeout(() => {
                  wifiservDummy.received({ wifiStatus: "CONNECTED" });
                }, 5000);
              } else if (data.ssid == "NETWORK_2" && data.password == "1234") {
                resolve();
              } else {
                reject("CLAVE INCORRECTA");
              }
            default:
              reject("No encontrado");
          }
        }, 1000);
      });
    }
  };
});
