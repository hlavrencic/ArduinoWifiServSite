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

define(["binder", "viewModel", "cmp/initComponents"], (
  binder,
  viewModel
) => {
  binder.bindKnockOut();
  viewModel.apply();
  binder.bindForms();
});
