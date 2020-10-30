var requireConfig = {
  deps: [
    "components/titlePath",
    "components/footerGit",
    "components/notificationBar",
    "components/wifiScan"
  ],
  paths: {
    wifiserv: "/lib/wifiserv",
    configParams: "/lib/configParams"
  },
  waitSeconds: 30
};

if (window.location.host.indexOf("stackblitz.io") >= 0) {
  requireConfig.paths.wifiserv = "/lib/wifiservDummy";
}

require.config(requireConfig);

define([
  "wifiserv",
  "binder",
  "viewModel",
  "knockout",
  "viewModelHistory",
  "viewModelStatus",
  "viewModelWifi"
], (
  wifiServ,
  binder,
  viewModel,
  ko,
  viewModelHistory,
  viewModelStatus,
  viewModelWifi
) => {
  wifiServ.subscribe(console.log);

  viewModelHistory.subscribe(viewModel);
  viewModelStatus.subscribe(viewModel);
  binder.bindViewModel(viewModelStatus);

  ko.applyBindings(viewModel);
  binder.bindForms();

  var conectionPromise = wifiServ.initWebSocket();

  conectionPromise = conectionPromise.then(() => {
    //Conectado
  });
});
