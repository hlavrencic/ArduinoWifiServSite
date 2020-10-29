define(["knockout"], ko => {
  class ViewModel {
    connectionStatus = ko.observable();
    sentData = ko.observable();
    lastResponse = ko.observable();
    error = ko.observable();
  }

  return new ViewModel();
});
