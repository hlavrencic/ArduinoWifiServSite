class ScanController {
  constructor(blocker, viewModelWifi, viewModel) {
    this.blocker = blocker;
    this.viewModelWifi = viewModelWifi;
    this.viewModel = viewModel;
  }

  init() {
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
  }
}

define(["knockout", "viewModel", "wifiserv", "mods/blocker", "viewModelWifi"], (
  ko,
  viewModel,
  wifiServ,
  blocker,
  viewModelWifi
) => {
  new ScanController(blocker, viewModelWifi, viewModel).init();
  ko.components.register("wifiscan", {
    viewModel: {
      createViewModel: (params, componentInfo) => {
        viewModel.scan = () => {
          let data = { SCAN_WIFI: 1 };
          wifiServ.send(data);
          viewModel.sentData(data);
        };
        return viewModel;
      }
    },
    template: { require: "text!components/wifiScan.html" }
  });
});
