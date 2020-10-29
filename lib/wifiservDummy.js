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
      }
    }, 1000);
  }
}

define([], () => new WifiservDummy());
