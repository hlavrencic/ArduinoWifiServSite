let SOCKET_URL = "wss://echo.websocket.org";


(function(){
  // Get HTML head element 
  var head = document.getElementsByTagName('HEAD')[0];  

  // Create new link Element 
  var link = document.createElement('link'); 

  // set the attributes for link element  
  link.rel = 'stylesheet';  

  link.type = 'text/css'; 

  link.href = '/css/style.css';  

  // Append link element to HTML head 
  head.appendChild(link); 
})();

var wifiServ = new WifiServ();
var viewModel = new Binder(wifiServ, ko).bind();
var applyBindings = new Promise(resolve => {
    resolve(viewModel);
});
setTimeout(() => {
    applyBindings.then(() => ko.applyBindings(viewModel));
}, 100);
wifiServ.initWebSocket(SOCKET_URL);
