define(["knockout", "apiService", "mods/blocker", "mods/wifiStatus"], (
  ko,
  apiService,
  blocker,
  wifiStatus
) => {
  class NetWorkComponent {
    constructor(ko, apiService, blocker, wifiStatus, params) {
      this.apiService = apiService;
      this.blocker = blocker;
      this.wifiStatus = wifiStatus;

      this.ssid = ko.observable(params.ssid);
      this.password = ko.observable();
    }

    connect() {
      let self = this;
      let data = {};
      data.ssid = self.ssid();
      data.password = self.password();

      self.apiService.post("connect", data).then(() => {
        let subscription = self.wifiStatus.wifiStatus.subscribe(
          status => {
            if (status != "CONNECTING") {
              subscription.dispose();
              self.blocker.off();
              if (status == "ERROR") {
                let error = self.wifiStatus.reason();
                self.blocker.on(error);
              }
            }
          }
        );

        self.blocker.loading(() => {
          subscription.dispose();
        });
      });

      self.blocker.loading();
    }
  }

  ko.components.register("network", {
    viewModel: {
      createViewModel: (params, componentInfo) => {
        let model = new NetWorkComponent(
          ko,
          apiService,
          blocker,
          wifiStatus,
          params
        );

        return model;
      }
    },
    template: { require: "text!cmp/network.html" }
  });
});
