define(["knockout", "axios", "mods/blocker"], (ko, axios, blocker) => {
  class NetWorkComponent {
    constructor(ko, axios, blocker) {
      this.axios = axios;
      this.blocker = blocker;
      this.ssid = ko.observable();
      this.password = ko.observable();
    }

    connect() {
      let self = this;
      let data = {};
      data.ssid = self.ssid();
      data.password = self.password();

      self.axios
        .post("connect", data)
        .then(function(response) {
          self.blocker.off();
        })
        .catch(function(error) {
          self.blocker.on(error);
        });

      self.blocker.on();
    }
  }

  ko.components.register("network", {
    viewModel: {
      createViewModel: (params, componentInfo) => {
        let model = new NetWorkComponent(ko, axios, blocker);
        console.log(params);
        model.ssid(params.ssid);
        return model;
      }
    },
    template: { require: "text!cmp/network.html" }
  });
});
