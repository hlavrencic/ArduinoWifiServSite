var SOCKET_URL = "wss://echo.websocket.org";

let loadExternalHtml = (tagName, url) => {
  let promesa = new Promise((resolve, reject)=> {
    try{
      debugger;
      let tags = document.getElementsByTagName(tagName);
      if(tags.length == 0 ){
        resolve();
        return;
      }

      let tagElem = tags[0];
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        let newHeader = this.responseXML.getElementsByTagName(tagName)[0];
        tagElem.replaceWith(newHeader);
        resolve(newHeader);
      }
      xhr.open("GET", url);
      xhr.responseType = "document";
      xhr.send();
    }catch(e){
      reject(e);
    }
  });

  return promesa;
};

var wifiServ = new WifiServ();
wifiServ.subscribe(console.log);
var binder = new Binder(wifiServ, ko);
var viewModel = binder.bindViewModel();
var applyBindings = new Promise(resolve => {
    resolve(viewModel);
});

let loadHeader = loadExternalHtml('cabecera', "/lib/header.html");
let loadFooter = loadExternalHtml('footer', "/lib/footer.html");
Promise.all([loadHeader, loadFooter])
.then(() => {
  applyBindings
    .then(() => ko.applyBindings(viewModel))
    .then(() => binder.bindForms());
})
.catch(e => console.error(e));

var conectionPromise = wifiServ.initWebSocket(SOCKET_URL);

conectionPromise = conectionPromise
  .then(() => {
    //Conectado
  });