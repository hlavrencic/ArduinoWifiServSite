class ScanController {
  constructor($, viewModelWifi) {
    this.$ = $;
    this.viewModelWifi = viewModelWifi;
  }

  init() {
    let self = this;
    viewModelWifi.sentData.subscribe(sent => {
      if (sent.SSID) {
        self.$.blockUI({});
      }
    });
  }
}

define(["jquery", "blockUI", "viewModelWifi"], $ => {
  new ScanController($, viewModelWifi).init();
});
