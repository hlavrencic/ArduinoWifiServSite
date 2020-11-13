class WifiScan {
  constructor(blocker, viewModelWifi, viewModel, axios) {
    this.blocker = blocker;
    this.viewModelWifi = viewModelWifi;
    this.viewModel = viewModel;
    this.axios = axios;
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

    viewModel.scan = () => self.scan();
  }

  scan() {
    let self = this;
    let data = { SCAN_WIFI: 1 };
    self.axios
      .post("scan", data)
      .then(function(response) {
        console.log(response);
        self.viewModelWifi.networks(response.scan);
        self.blocker.off();
      })
      .catch(function(error) {
        self.blocker.on(error);
      });

    self.blocker.on();
  }
}

define(["knockout", "viewModel", "mods/blocker", "viewModelWifi", "axios"], (
  ko,
  viewModel,
  blocker,
  viewModelWifi,
  axios
) => {
  new WifiScan(blocker, viewModelWifi, viewModel, axios).subscribe(viewModel);
  ko.components.register("wifiscan", {
    viewModel: { instance: viewModel },
    template: { require: "text!cmp/wifiScan.html" }
  });
});
