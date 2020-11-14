class WifiservDummy {
  _subscribers = [];
  _status;
  _sendStatusSwitch = false;

  initWebSocket() {
    let self = this;
    let promesa = new Promise(resolve => {
      setTimeout(() => {
        resolve();
        self._status("OPENED");
      }, 1000);
    });

    setInterval(() => {
      if (!self._sendStatusSwitch) return;

      self.received({
        wifi: {
          status: "CONNECTED",
          ip: "192.168.1.101",
          gw: "192.168.1.1",
          mask: "255.255.0.0",
          reason: null,
          ssid: "NETWORK_1",
          channel: 5
        }
      });
    }, 5000);

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
          wifiStatus: "CONNECTING"
        });

        setTimeout(() => {
          self.received({
            wifiStatus: "CONNECTED",
            ip: "192.168.1.101"
          });

          setTimeout(() => {
            self.received({
              wifiStatus: "CLOSED"
            });
          }, 10000);
        }, 1000);
      } else if (obj.sendStatusSwitch) {
        self._sendStatusSwitch = true;
      }
    }, 1000);
  }
}

define([], () => {
  let serv = new WifiservDummy();
  serv.initWebSocket();
  return serv;
});
