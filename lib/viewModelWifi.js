class ViewModelWifi {
  ko;

  constructor(ko) {
    let self = this;

    self.ko = ko;

    self.status = ko.observable();
    self.ip = ko.observable();
  }

  subscribe(viewModel) {
    let self = this;

    viewModel.lastResponse.subscribe(response => {
      if (response.ip) {
        self.ip(response.ip);
      }

      if (response.wifiStatus) {
        self.status(response.wifiStatus);
      }
    });

    viewModel.wifi = self.ko.observable(self);
  }
}

define(["knockout", "viewModel"], (knockout, viewModel) =>
  new ViewModelWifi(knockout).subscribe(viewModel));
