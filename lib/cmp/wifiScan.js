class WifiScan {
  constructor(ko, blocker, axios) {
    this.blocker = blocker;
    this.axios = axios;
    this.ko = ko;

    this.networks = ko.observableArray();
  }

  scan() {
    let self = this;
    self.blocker.on();

    self.axios
      .post("startScan")
      .then(() => {
        let interval = setInterval(() => {
          self.getScan(scan => {
            clearInterval(interval);
            self.blocker.off();
            self.networks(scan);
          });
        }, 2000);
      })
      .catch(function(error) {
        self.blocker.on(error);
      });
  }

  getScan(callbackReady) {
    let self = this;

    self.axios.post("getScan").then(rta => {
      if (rta.scan) callbackReady(rta.scan);
    });
  }
}

define(["knockout", "mods/blocker", "axios"], (ko, blocker, axios) => {
  let viewModel = new WifiScan(ko, blocker, axios);
  ko.components.register("wifiscan", {
    viewModel: { instance: viewModel },
    template: { require: "text!cmp/wifiScan.html" }
  });
});
