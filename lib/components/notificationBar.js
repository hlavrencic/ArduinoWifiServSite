class NotificationBar {
  ko;
  connectionStatus;

  constructor(ko) {
    this.ko = ko;

    this.console = ko.observableArray();
    this.socketResponsesAlert = ko.observable(false);
    this.showConsole = ko.observable(false);
    this.wifiStatus = ko.observable();
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

    viewModel.status = self.ko.observable(this);
  }

  subscribeWifi(viewModelWifi) {
    let self = this;
    viewModelWifi.status.subscribe(status => self.wifiStatus(status));
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

define(["knockout", "viewModel", "viewModelWifi"], (
  ko,
  viewModel,
  viewModelWifi
) => {
  ko.components.register("notification-bar", {
    viewModel: {
      createViewModel: (params, componentInfo) => {
        let model = new NotificationBar(ko);
        model.subscribeSocket(viewModel);
        model.subscribeWifi(viewModelWifi);
        return model;
      }
    },
    template: { require: "text!components/notificationBar.html" }
  });
});
