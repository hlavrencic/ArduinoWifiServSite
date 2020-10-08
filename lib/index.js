var SOCKET_URL = "wss://echo.websocket.org";



var wifiServ = new WifiServ();
wifiServ.subscribe(console.log);
var binder = new Binder(wifiServ, ko);
var viewModel = binder.bindViewModel();
var applyBindings = new Promise(resolve => {
    resolve(viewModel);
});
$("#header").load("/lib/header.html", () => {
  
  applyBindings
      .then(() => { return this;//ko.applyBindings(viewModel)
      })
      .then(() => { binder.bindForms()
      });
});

var conectionPromise = wifiServ.initWebSocket(SOCKET_URL);

conectionPromise = conectionPromise
  .then(() => {
    //Conectado
  });
