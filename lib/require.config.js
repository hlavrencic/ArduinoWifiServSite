var require = {
  paths: {
    wifiserv: "/lib/wifiserv",
    socketURL: "/lib/socketURL"
  }
};

if (window.location.host.indexOf("stackblitz.io") >= 0) {
  require.paths.wifiserv = "/lib/wifiservDummy";
}
