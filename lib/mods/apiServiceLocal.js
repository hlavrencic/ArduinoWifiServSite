class ApiServiceLocal {
  constructor(apiService) {
    this.apiService = apiService;
  }

  post(uri, data) {
    uri = "lib/dmy/" + uri + ".json";
    return this.apiService.get(uri);
  }
}

define(["apiServiceReal"], apiService => {
  return new ApiServiceLocal(apiService);
});
