// Define the function that will submit a POST request to the server
let api = {
  
  async get_user() {
    let params = this.createGetRequest();
    let response = await fetch('/user', params);
    let json = await response.json();
    return json;
  },
  
  async guess(name) {
      const data = { name };
      let request = this.createPostRequest(data);
      let response = await fetch('/characters/guess', request);
      return response;
  },

  async get(id=null) {
      let response;
      if (id != null) {
        response = await fetch(`/characters/get/${id}`);
      } else {
        response = await fetch('/characters/get');
      }
      return response;
  },

  async add(name) {
      const data = { name }; 
      let request = this.createPostRequest(data);
      let response = await fetch('/characters/add', request);
      return response;
  },

  async reset() {
      let response = await fetch('/characters/reset');
      return response;
  },

  createPostRequest(data) {
    const request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    };
    return request;
  },

  createGetRequest() {
    const request = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      },
    };
    return request;
  }

}