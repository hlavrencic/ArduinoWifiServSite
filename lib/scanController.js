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

define(["jquery", "blockUI", "viewModelWifi", "viewModel"], (
  $,
  blockUI,
  viewModelWifi,
  viewModel
) => {
  debugger;
  new ScanController($, viewModelWifi, viewModel).init();
});
