class ScanController {
  constructor($, viewModelWifi, viewModel) {
    this.$ = $;
    this.viewModelWifi = viewModelWifi;
    this.viewModel = viewModel;
  }

  init() {
    let self = this;
    self.viewModel.sentData.subscribe(sent => {
      if (sent.SSID) {
        let $msg = $("<p>Connecting...</p>");
        self.$.blockUI({ message: $msg });
      }
    });

    self.viewModelWifi.status.subscribe(status => {
      if (status != "CONNECTING") {
        self.$.unblockUI();
      }
    });
  }
}

define(["knockout", "viewModel", "wifiserv"], (ko, viewModel, wifiServ) => {
  //new ScanController($, viewModelWifi, viewModel).init();
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
