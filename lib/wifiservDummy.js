class WifiservDummy {
  _subscribers = [];
  _status;
  initWebSocket() {
    let self = this;
    let promesa = new Promise(resolve => {
      setTimeout(() => {
        resolve();
        self._status("OPENED");
      }, 1000);
    });
    return promesa;
  }

  subscribe(readResponse) {
    this._subscribers.push(readResponse);
  }

  received(obj) {
    this._subscribers.forEach(readResponse => readResponse(obj));
  }

  send(obj) {
    let self = this;
    setTimeout(() => {
      if (obj.SCAN_WIFI) {
        self.received({
          scan: [{ ssid: "NETWORK_1" }, { ssid: "NETWORK_2" }]
        });
      } else if (obj.SSID) {
        self.received({
          wifiStatus: "CLOSED"
        });
        setTimeout(() => {
          self.received({
            wifiStatus: "CONNECTING"
          });

          setTimeout(() => {
            self.received({
              wifiStatus: "CONNECTED",
              ip: "192.168.1.101"
            });

            setTimeout(() => {
              self.received({
                wifiStatus: "ERROR"
              });
            }, 10000);
          }, 1000);
        }, 1000);
      }
    }, 1000);
  }
}

define([], () => new WifiservDummy());
