class TitlePath {
  constructor(params) {
    debugger;
  }

  getLocation() {
    return window.location.pathname;
  }
}

define(["knockout", "requireText"], (ko, text) => {
  ko.components.register("title-path", {
    viewModel: TitlePath,
    template: { require: "text!titlePath.html" }
  });
});
