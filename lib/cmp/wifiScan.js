class WifiScan {
  constructor(ko, blocker, axios) {
    this.blocker = blocker;
    this.axios = axios;
    this.ko = ko;

    this.networks = ko.observableArray();
  }

  scan() {
    let self = this;
    let data = { SCAN_WIFI: 1 };
    self.axios
      .post("scan", data)
      .then(function(response) {
        self.viewModelWifi.networks(response.scan);
        self.blocker.off();
      })
      .catch(function(error) {
        self.blocker.on(error);
      });

    self.blocker.on();
  }
}

define(["knockout", "mods/blocker", "axios"], (ko, blocker, axios) => {
  let viewModel = new WifiScan(ko, blocker, axios);
  ko.components.register("wifiscan", {
    viewModel: { instance: viewModel },
    template: { require: "text!cmp/wifiScan.html" }
  });
});
