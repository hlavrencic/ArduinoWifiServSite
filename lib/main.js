var requireConfig = {
  baseUrl: "/lib",
  paths: {
    wifiserv: "wifiserv",
    configParams: "configParams"
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
  "viewModelStatus",
  "viewModelWifi",
  "components/initComponents"
], (wifiServ, binder, viewModel, viewModelStatus, viewModelWifi) => {
  viewModelStatus.subscribe(viewModel);

  binder.bindKnockOut();
  viewModel.apply();
  binder.bindForms();

  wifiServ.initWebSocket();
});
