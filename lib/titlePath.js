class TitlePath {
  constructor(params) {
    debugger;
  }

  getLocation() {
    return window.location.pathname;
  }
}

define(["knockout"], ko => {
  ko.components.register("title-path", {
    viewModel: TitlePath,
    template: { require: "titlePath" }
  });
});
