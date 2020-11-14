class NotificationBar {
  ko;
  connectionStatus;

  constructor(ko, axios) {
    this.ko = ko;
    this.axios = axios;

    this.console = ko.observableArray();
    this.socketResponsesAlert = ko.observable(false);
    this.showConsole = ko.observable(false);
    this.showWifi = ko.observable(false);
    this.wifiStatus = ko.observable();
    this.ip = ko.observable();
    this.gw = ko.observable();
    this.mask = ko.observable();
    this.reason = ko.observable();
    this.aid = ko.observable();
    this.ssid = ko.observable();
    this.channel = ko.observable();

    this.autoSync = ko.observable(true);

    this.initPoll();
  }

  autoSyncText() {
    let rta = "Sync: ";
    if (this.autoSync()) rta += "ON";
    else rta += "OFF";
    return rta;
  }

  subscribeSocket(viewModel) {
    let self = this;

    viewModel.lastResponse.subscribe(r => {
      self._addConsole(1, JSON.stringify(r));
    });

    viewModel.sentData.subscribe(sent => {
      self._addConsole(2, JSON.stringify(sent));
    });

    viewModel.error.subscribe(error => {
      self._addConsole(3, error);
    });

    self.socketResponsesAlert.subscribe(v =>
      setTimeout(() => {
        if (self.socketResponsesAlert()) self.socketResponsesAlert(false);
      }, 1000)
    );

    self.connectionStatus = viewModel.connectionStatus;
  }

  initPoll() {
    let self = this;

    setInterval(() => {
      if (!self.autoSync()) return;

      self.axios
        .post("wifiStatus")
        .then(wifi => {
          self.ip(wifi.ip);
          self.gw(wifi.gw);
          self.mask(wifi.mask);
          self.reason(wifi.reason);
          self.aid(wifi.aid);
          self.ssid(wifi.ssid);
          self.channel(wifi.channel);
          self.wifiStatus(wifi.status);
        })
        .catch(error => {
          console.error(error);
        });
    }, 5000);
  }

  getLocation() {
    return window.location.pathname;
  }

  consoleTypeSymbol(type) {
    switch (type) {
      case 1:
        return "↘";
      case 2:
        return "↖";
      default:
        return "";
    }
  }

  _addConsole(type, data) {
    this.console.push({
      time: new Date(),
      data: data,
      type: type
    });
  }
}

define(["knockout", "viewModel", "axios"], (ko, viewModel, axios) => {
  ko.components.register("notification-bar", {
    viewModel: {
      createViewModel: (params, componentInfo) => {
        let model = new NotificationBar(ko, axios);
        model.subscribeSocket(viewModel);
        return model;
      }
    },
    template: { require: "text!cmp/notificationBar.html" }
  });
});
