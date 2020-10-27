class ViewModelStatus {
  wifiStatus = ko.observable();
  console = ko.observableArray();
  connectionStatus = ko.observable();
  socketResponsesAlert = ko.observable(false);
  showConsole = ko.observable(false);

  subscribe(viewModel) {
    let self = this;

    viewModel.lastResponse.subscribe(r => {
      if (r.wifiStatus) {
        self.wifiStatus(r.wifiStatus);
      }

      self._addConsole(1, JSON.stringify(r));
    });

    viewModel.sentData.subscribe(sent => {
      self._addConsole(2, JSON.stringify(sent));
    });

    viewModel.error.subscribe(error => {
      self._addConsole(3, error);
    });

    self.socketResponsesAlert.subscribe(v =>
      setTimeout(() => {
        if (self.socketResponsesAlert()) self.socketResponsesAlert(false);
      }, 1000)
    );

    viewModel.status = ko.observable(this);
  }

  getLocation() {
    return window.location.pathname;
  }

  consoleTypeSymbol(type) {
    switch (type) {
      case 1:
        return "↘";
      case 2:
        return "↖";
      default:
        return "";
    }
  }

  _addConsole(type, data) {
    this.console.push({
      time: new Date(),
      data: data,
      type: type
    });
  }
}

class ViewModelHistory {
  socketResponses = ko.observableArray();
  sentDataHistory = ko.observableArray();
  errors = ko.observableArray();

  subscribe(viewModel) {
    let self = this;
    viewModel.lastResponse.subscribe(r => self.socketResponses.push(r));
    viewModel.sentData.subscribe(d => self.sentDataHistory.push(d));
    viewModel.error.subscribe(e => self.errors.push(e));

    viewModel.history = ko.observable(self);
  }
}

class ViewModel {
  connectionStatus = ko.observable();
  sentData = ko.observable();
  lastResponse = ko.observable();
  error = ko.observable();
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

  bindViewModel(viewModelStatus) {
    this._wifiServ._status = val => viewModelStatus.connectionStatus(val);
    this._wifiServ._errorEvt = evt => this._viewModel.error(evt);
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

    Date.prototype.formatMMDDYYYY = function() {
      return (
        this.getFullYear() +
        "/" +
        this.getMonth() +
        1 +
        "/" +
        this.getDate() +
        " " +
        this.getHours() +
        ":" +
        this.getMinutes() +
        ":" +
        this.getSeconds()
      );
    };

    ko.bindingHandlers.date = {
      update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var date = valueAccessor();
        var strDate = date.formatMMDDYYYY();
        if ($(element).is(":input")) $(element).val(strDate);
        else $(element).text(strDate);
      }
    };

    this._wifiServ.subscribe(obj => {
      this._viewModel.lastResponse(obj);
      this.bindForms();
    });
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
        self._viewModel.sentData(model);
      };
      formElement.addEventListener("submit", handler);
      self._formElementsBindeados.push({ formElement, handler });
    });
  }
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined")
  module.exports = Binder;
