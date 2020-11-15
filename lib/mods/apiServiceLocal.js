class ApiServiceLocal {
  constructor(apiService) {
    this.apiService = apiService;
  }

  post(uri, data) {
    let random;

    switch (uri) {
      case "getScan":
        random = Math.trunc(Math.random() * 3);
        if (random != 1) {
          uri = "vacio";
        }
        break;
      case "wifiStatus":
        random = Math.trunc(Math.random() * 3);
        uri += random;
        break;
    }

    uri = "lib/dmy/" + uri + ".json";
    return this.apiService.get(uri);
  }
}

define(["apiServiceReal"], apiService => {
  return new ApiServiceLocal(apiService);
});
