define(["knockout", "apiService", "mods/blocker", "mods/wifiStatusViewModel"], (
  ko,
  apiService,
  blocker,
  wifiStatusViewModel
) => {
  class NetWorkComponent {
    constructor(ko, apiService, blocker, wifiStatusViewModel, params) {
      this.apiService = apiService;
      this.blocker = blocker;
      this.wifiStatusViewModel = wifiStatusViewModel;

      this.ssid = ko.observable(params.ssid);
      this.password = ko.observable();
    }

    connect() {
      let self = this;
      let data = {};
      data.ssid = self.ssid();
      data.password = self.password();

      self.apiService.post("connect", data).then(() => {
        let subscription = self.wifiStatusViewModel.wifiStatus.subscribe(
          status => {
            if (status != "CONNECTING") {
              subscription.dispose();
              self.blocker.off();
              if (status == "ERROR") {
                let error = self.wifiStatusViewModel.reason();
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
          wifiStatusViewModel,
          params
        );

        return model;
      }
    },
    template: { require: "text!cmp/network.html" }
  });
});
