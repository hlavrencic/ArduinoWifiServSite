define([
  "./wifiservDummy",
  "./binder",
  "./viewModel",
  "./knockout",
  "./viewModelHistory",
  "./viewModelStatus"
], (wifiServ, binder, viewModel, ko, viewModelHistory, viewModelStatus) => {
  let loadExternalHtml = (tagName, url) => {
    let promesa = new Promise((resolve, reject) => {
      try {
        let tags = document.getElementsByTagName(tagName);
        if (tags.length == 0) {
          resolve();
          return;
        }

        let tagElem = tags[0];
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
          let newHeader = this.responseXML.getElementsByTagName(tagName)[0];
          tagElem.replaceWith(newHeader);
          resolve(newHeader);
        };
        xhr.open("GET", url);
        xhr.responseType = "document";
        xhr.send();
      } catch (e) {
        reject(e);
      }
    });

    return promesa;
  };

  wifiServ.subscribe(console.log);

  viewModelHistory.subscribe(viewModel);
  viewModelStatus.subscribe(viewModel);
  binder.bindViewModel(viewModelStatus);
  var applyBindings = new Promise(resolve => {
    resolve(viewModel);
  });

  let loadHeader = loadExternalHtml("cabecera", "/lib/header.html");
  let loadFooter = loadExternalHtml("footer", "/lib/footer.html");
  Promise.all([loadHeader, loadFooter])
    .then(() => {
      applyBindings
        .then(() => ko.applyBindings(viewModel))
        .then(() => binder.bindForms());
    })
    .catch(e => console.error(e));

  var conectionPromise = wifiServ.initWebSocket();

  conectionPromise = conectionPromise.then(() => {
    //Conectado
  });
});
