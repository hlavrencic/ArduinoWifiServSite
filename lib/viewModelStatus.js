class ViewModelStatus {
  ko;
  constructor(ko) {
    this.ko = ko;

    this.wifiStatus = ko.observable();
    this.console = ko.observableArray();
    this.connectionStatus = ko.observable();
    this.socketResponsesAlert = ko.observable(false);
    this.showConsole = ko.observable(false);
  }

  subscribe(viewModel) {
    let self = this;

    viewModel.lastResponse.subscribe(r => {
      if (r.wifiStatus) {
        self.wifiStatus(r.wifiStatus);
      }

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

    viewModel.status = self.ko.observable(this);
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

define(["./knockout"], ko => new ViewModelStatus(ko));
