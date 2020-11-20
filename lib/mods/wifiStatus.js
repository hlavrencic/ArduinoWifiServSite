class WifiStatusViewModel {
  static WifiStatus = {
    WL_IDLE_STATUS: 0,
    WL_NO_SSID_AVAIL: 1,
    WL_SCAN_COMPLETED: 2,
    WL_CONNECTED: 3,
    WL_CONNECT_FAILED: 4,
    WL_CONNECTION_LOST: 5,
    WL_DISCONNECTED: 6
  };

  static StatusName(code) {
    switch (code) {
      case 0:
        return "IDLE";
      case 1:
        return "SCAN";
      case 3:
        return "CONNECTED";
      case 4:
        return "FAILED";
      case 5:
        return "LOST";
      case 6:
        return "DISCONNECTED";
      default:
        return "";
    }
  }

  syncInterval = 0;
  pollTimeout;

  constructor(ko, apiService, blocker) {
    this.ko = ko;
    this.apiService = apiService;
    this.blocker = blocker;

    this.wifiStatus = ko.observable();
    this.wifiStatusTxt = ko.observable();
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
      } else {
        if (self.pollTimeout) {
          clearTimeout(self.pollTimeout);
        }
      }
    });

    self.wifiStatus.subscribe(status =>
      self.wifiStatusTxt(WifiStatusViewModel.StatusName(status))
    );
  }

  waitConnection(cancellationToken) {
    let self = this;

    self.initPoll(1000).then(poll => console.log("poll"));

    let prom = new Promise((resolve, reject) => {
      let sus = self.wifiStatus.subscribe(status => {
        if (
          (cancellationToken && cancellationToken.cancel) ||
          status == WifiStatusViewModel.WifiStatus.WL_CONNECTED ||
          status == WifiStatusViewModel.WifiStatus.WL_CONNECT_FAILED
        ) {
          sus.dispose();
          self.initPoll();

          if (status == WifiStatusViewModel.WifiStatus.WL_CONNECTED) {
            resolve();
          } else if (status == WifiStatusViewModel.WifiStatus.WL_CONNECT_FAILED) {
            reject(self.reason());
          }
        }
      });
    });

    return prom;
  }

  initPoll(interval) {
    let self = this;

    if (self.pollTimeout) {
      clearTimeout(self.pollTimeout);
    }

    if (!interval) {
      self.syncInterval = 5000;
    } else {
      self.syncInterval = interval;
    }

    self.autoSync(true);

    let prom = self
      .getData()
      .then(
        () =>
          new Promise(resolve => {
            self.pollTimeout = setTimeout(resolve, self.syncInterval);
          })
      )
      .then(() => {
        return self.initPoll(self.syncInterval);
      });

    return prom;
  }

  getData() {
    let self = this;

    let rta = self.apiService
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
      })
      .catch(error => {
        self.blocker.on(error);
      });

    return rta;
  }
}

define(["knockout", "apiService", "mods/blocker"], (
  ko,
  apiService,
  blocker
) => {
  return new WifiStatusViewModel(ko, apiService, blocker);
});
