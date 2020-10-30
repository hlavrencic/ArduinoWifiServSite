define(["knockout", "viewModel"], (ko, viewModel) => {
  ko.components.register("notification-bar", {
    viewModel: { instance: viewModel },
    template: { require: "text!components/notificationBar.html" }
  });
});
