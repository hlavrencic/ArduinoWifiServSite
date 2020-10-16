class ViewModel {
  _ko;
  constructor(ko) {
    this._ko = ko;

    let viewModel = this;
    viewModel.showConsole = this._ko.observable(false);
    viewModel.connectionStatus = this._ko.observable();
    viewModel.socketResponses = this._ko.observableArray();
    viewModel.socketResponsesAlert = this._ko.observable(false);
    viewModel.errors = this._ko.observableArray();
    viewModel.sentData = this._ko.observableArray();
    viewModel.lastResponse = this._ko.computed(() => {
      return viewModel.socketResponses.slice(-1);
    });
    viewModel.wifiStatus = this._ko.computed(() => {
      let statuses = viewModel
        .socketResponses()
        .filter(r => r.wifiStatus)
        .map(r => r.wifiStatus);
      if (statuses.length > 0) {
        return statuses[statuses.length - 1];
      }
      return null;
    });
    viewModel.locationPathName = this._ko.computed(() => {
      return window.location.pathname;
    });
    viewModel.allEvents = this._ko.computed(() => {
      return viewModel
        .socketResponses()
        .concat(viewModel.errors())
        .concat(viewModel.sentData())
        .map(JSON.stringify);
    });
  }
}

class Binder {
  _wifiServ;
  _ko = ko;
  _formElementsBindeados = [];
  _viewModel;

  constructor(wifiServ, viewModel) {
    this._wifiServ = wifiServ;
    this._ko = ko;
    this._viewModel = viewModel;
  }

  bindViewModel() {
    this._wifiServ._status = val => this._viewModel.connectionStatus(val);
    this._wifiServ._errorEvt = evt => this._viewModel.errors.push(evt);
    this._bindKnockOut();
  }

  _bindKnockOut() {
    let self = this;

    ko.bindingHandlers.textWithInit = {
      init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor();

        if (!ko.isObservable(viewModel[value])) {
          viewModel[value] = ko.observable(viewModel[value]);
        }
      },
      update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        ko.bindingHandlers.text.update(element, function() {
          return viewModel[valueAccessor()];
        });
      }
    };

    this._wifiServ.subscribe(obj => {
      this._viewModel.socketResponses.push(obj);
      self._newSocketResponsesAlert();
    });
    this._wifiServ.subscribe(obj => this.bindForms());
  }

  bindForms() {
    let self = this;

    self._formElementsBindeados.forEach(formElementBindeado => {
      formElementBindeado.formElement.removeEventListener(
        "submit",
        formElementBindeado.handler
      );
    });
    self._formElementsBindeados = [];

    let formElements = document.querySelectorAll("form");
    formElements.forEach(formElement => {
      let handler = event => {
        event.preventDefault();
        let formData = new FormData(formElement);
        let model = Object.fromEntries(formData);
        formElement.reset();
        self._wifiServ.send(model);
        self._viewModel.sentData.push(model);
      };
      formElement.addEventListener("submit", handler);
      self._formElementsBindeados.push({ formElement, handler });
    });
  }

  _newSocketResponsesAlert() {
    this._viewModel.socketResponsesAlert(true);
    setTimeout(() => this._viewModel.socketResponsesAlert(false), 1000);
  }
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined")
  module.exports = Binder;
