class WifiStatusViewModel {
  static WifiStatus = {
    WL_IDLE_STATUS: 0,
    WL_NO_SSID_AVAIL: 1,
    WL_SCAN_COMPLETED: 2,
    WL_CONNECTED: 3,
    WL_CONNECT_FAILED: 4,
    WL_CONNECTION_LOST: 5,
    WL_DISCONNECTED: 6
  }

  constructor(ko, apiService) {
    this.ko = ko;
    this.apiService = apiService;

    this.wifiStatus = ko.observable();
    this.ip = ko.observable();
    this.gw = ko.observable();
    this.mask = ko.observable();
    this.reason = ko.observable();
    this.aid = ko.observable();
    this.ssid = ko.observable();
    this.channel = ko.observable();

    let self = this;
    self.autoSync = ko.observable();
    self.autoSync.subscribe(value => {
      if (value) {
        self.initPoll();
      }
    });
  }

  initPoll() {
    let self = this;

    setTimeout(() => {
      if (!self.autoSync()) return;

      self.apiService
        .post("wifiStatus")
        .then(wifi => {
          self.ip(wifi.ip);
          self.gw(wifi.gw);
          self.mask(wifi.mask);
          self.reason(wifi.reason);
          self.aid(wifi.aid);
          self.ssid(wifi.ssid);
          self.channel(wifi.channel);
          self.wifiStatus(wifi.wifiStatus);

          self.initPoll();
        })
        .catch(error => {
          self.blocker.on(error);
        });
    }, 5000);
  }
}

define(["knockout", "apiService"], (ko, apiService) => {
  return new WifiStatusViewModel(ko, apiService);
});
