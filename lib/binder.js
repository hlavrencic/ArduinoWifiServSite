class Binder {

  
  _wifiServ;
  _ko = ko
  constructor(wifiServ, ko){
      this._wifiServ = wifiServ;
      this._ko = ko;
  }

  bindViewModel(){
    let viewModel = this._bindKnockOut();
    this._wifiServ._status = val => viewModel.connectionStatus(val);
    this._wifiServ._errorEvt = evt => viewModel.errors.push(evt);
    return viewModel;
  }

  _bindKnockOut(){
    let viewModel = { };

    ko.bindingHandlers.textWithInit = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = valueAccessor();

            if (!ko.isObservable(viewModel[value])) {
                viewModel[value] = ko.observable(viewModel[value]);   
            }
        },
        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            ko.bindingHandlers.text.update(element, function() { return viewModel[valueAccessor()]; });
        }
    };

    viewModel.connectionStatus = this._ko.observable();
    viewModel.socketResponses = this._ko.observableArray();
    viewModel.errors = this._ko.observableArray();
    viewModel.lastResponse = this._ko.computed(() => {
      return viewModel.socketResponses.slice(-1);
    });
    viewModel.allEvents = this._ko.computed(() => {
      return viewModel.socketResponses().concat(viewModel.errors()).map(JSON.stringify);
    });

    this._wifiServ.subscribe(obj => viewModel.socketResponses.push(obj));
    this._wifiServ.subscribe(obj => this.bindForms());
    return viewModel;
  }

  bindForms(){
    let self = this;
    var formElements = document.querySelectorAll("form");
    formElements.forEach(formElement => {
      formElement.addEventListener('submit', event => {
        event.preventDefault();
        let formData = new FormData(formElement);
        let model = Object.fromEntries(formData);
        formElement.reset();
        self._wifiServ.send(model);
      });
    });
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
module.exports = Binder; 
