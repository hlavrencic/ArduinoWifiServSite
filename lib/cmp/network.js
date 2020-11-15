define(["knockout", "apiService", "mods/blocker"], (
  ko,
  apiService,
  blocker
) => {
  class NetWorkComponent {
    constructor(ko, apiService, blocker, params) {
      this.apiService = apiService;
      this.blocker = blocker;
      this.ssid = ko.observable(params.ssid);
      this.password = ko.observable();
      this.callbackConnect = params.callbackConnect;
    }

    connect() {
      let self = this;
      let data = {};
      data.ssid = self.ssid();
      data.password = self.password();

      self.apiService.post("connect", data).then(() => {
        self.blocker.off();
        self.callbackConnect && self.callbackConnect();
      });

      self.blocker.loading();
    }
  }

  ko.components.register("network", {
    viewModel: {
      createViewModel: (params, componentInfo) => {
        let model = new NetWorkComponent(ko, apiService, blocker, params);

        return model;
      }
    },
    template: { require: "text!cmp/network.html" }
  });
});
