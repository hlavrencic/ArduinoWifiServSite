class ApiService {
  constructor(axios) {
    this.axios = axios;
  }

  post(uri, data) {
    let self = this;
    return self.axios.post(uri, data).then(rta => {
      if (rta.code != 200) {
        throw rta;
      }

      return rta.data;
    });
  }
}

define(["axios"], axios => {
  return new ApiService(axios);
});
