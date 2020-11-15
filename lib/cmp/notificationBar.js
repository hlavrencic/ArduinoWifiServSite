class NotificationBar {
  ko;
  connectionStatus;

  constructor(ko, apiService, blocker) {
    this.ko = ko;
    this.apiService = apiService;
    this.blocker = blocker;

    let self = this;

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

    self.autoSync = ko.observable();
    self.autoSync.subscribe(value => {
      if (value) {
        self.initPoll();
      }
    });

    self.autoSync(true);
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

    setTimeout(() => {
      if (!self.autoSync()) return;

      self.apiService
        .post("wifiStatus")
        .then(wifi => {
          self.ip(wifi.ip);
          self.gw(wifi.gw);
          self.mask(wifi.mask);
          self.reason(wifi.reason);
          self.aid(wifi.aid);
          self.ssid(wifi.ssid);
          self.channel(wifi.channel);
          self.wifiStatus(wifi.wifiStatus);

          self.initPoll();
        })
        .catch(error => {
          self.blocker.on(error);
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

define(["knockout", "viewModel", "apiService", "mods/blocker"], (
  ko,
  viewModel,
  apiService,
  blocker
) => {
  ko.components.register("notification-bar", {
    viewModel: {
      createViewModel: (params, componentInfo) => {
        let model = new NotificationBar(ko, apiService, blocker);
        model.subscribeSocket(viewModel);
        return model;
      }
    },
    template: { require: "text!cmp/notificationBar.html" }
  });
});
