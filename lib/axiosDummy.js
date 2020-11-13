define([], () => {
  return {
    post(uri, data) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          switch (uri) {
            case "scan":
              resolve({ scan: [{ ssid: "NETWORK_1" }, { ssid: "NETWORK_2" }] });
              break;
            default:
              reject("No encontrado");
          }
        }, 1000);
      });
    }
  };
});
