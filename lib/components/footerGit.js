define(["knockout"], ko => {
  ko.components.register("footer-git", {
    template: { require: "text!components/footerGit.html" }
  });
});
