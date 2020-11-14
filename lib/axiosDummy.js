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

            case "wifiStatus":
              let random = Math.round(Math.random() * 4);
              switch (random) {
                case 1:
                  resolve({
                    status: "CONNECTED",
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
                    status: "CONNECTING",
                    ssid: "NETWORK_1"
                  });
                  break;
                case 3:
                  resolve({
                    status: "ERROR",
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
