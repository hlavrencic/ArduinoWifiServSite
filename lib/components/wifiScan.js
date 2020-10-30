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

define(["knockout", "jquery", "blockUI", "viewModelWifi", "viewModel"], (
  ko,
  $,
  blockUI,
  viewModelWifi,
  viewModel
) => {
  new ScanController($, viewModelWifi, viewModel).init();
  ko.components.register("wifiscan", {
    viewModel: { instance: viewModel },
    template: { require: "text!components/footerGit.html" }
  });
});
