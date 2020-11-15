define(["wifiserv"], wifiservDummy => {
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
                    scan: [{ ssid: "NETWORK_1" }, { ssid: "NETWORK_2" }]
                  });
                  break;
                default:
                  resolve({});
              }

              break;
            case "startScan":
              resolve({});
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

            case "wifiStatus":
              random = Math.round(Math.random() * 4);
              switch (random) {
                case 1:
                  resolve({
                    wifiStatus: "CONNECTED",
                    ip: "192.168.1.101",
                    gw: "192.168.1.1",
                    mask: "255.255.0.0",
                    reason: null,
                    ssid: "NETWORK_1",
                    channel: 5
                  });
                  break;
                case 2:
                  resolve({
                    wifiStatus: "CONNECTING",
                    ssid: "NETWORK_1"
                  });
                  break;
                case 3:
                  resolve({
                    wifiStatus: "ERROR",
                    reason: 8,
                    ssid: "NETWORK_1"
                  });
                  break;
                default:
                  reject("Sin conexion");
              }

              break;
            default:
              reject("No encontrado");
          }
        }, 1000);
      });
    }
  };
});
