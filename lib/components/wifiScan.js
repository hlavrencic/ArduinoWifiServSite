class WifiScan {
  constructor(blocker, viewModelWifi, viewModel) {
    this.blocker = blocker;
    this.viewModelWifi = viewModelWifi;
    this.viewModel = viewModel;
  }

  subscribe(viewModel) {
    let self = this;
    self.viewModel.sentData.subscribe(sent => {
      if (sent.SSID) {
        self.blocker.on();
      }
    });

    self.viewModelWifi.status.subscribe(status => {
      if (status != "CONNECTING") {
        self.blocker.off();
      }
    });

    self.viewModelWifi.networks.subscribe(networks => {
      self.blocker.off();
    });

    viewModel.scan = self.scan;
  }

  scan() {
    let data = { SCAN_WIFI: 1 };
    this.viewModel.sentData(data);
    this.blocker.on();
  }
}

define(["knockout", "viewModel", "mods/blocker", "viewModelWifi"], (
  ko,
  viewModel,
  blocker,
  viewModelWifi
) => {
  new WifiScan(blocker, viewModelWifi, viewModel).subscribe(viewModel);
  ko.components.register("wifiscan", {
    viewModel: { instance: viewModel },
    template: { require: "text!components/wifiScan.html" }
  });
});
