const UNSPLASH_API_URL = 'https://api.unsplash.com';
const apiKey = 'b77e1fc43f6ee4ef99e396ba83df2c9167d58df02bbfc5a8757ef135b9a5ddad';
import Vue from 'vue';

export default () => {
  const getImageOfDay = success => {
    Vue.http.get(`${UNSPLASH_API_URL}/photos/random`, {
      before (request) {
        request.headers.delete('Authorization');
      },
      params: {
        client_id: apiKey
      }
    }).then(result => {
      success(result.body)
    })
  }
  
  const getImage = (id, success) => {
    Vue.http.get(`${UNSPLASH_API_URL}/photos/${id}`, {
      before (request) {
        request.headers.delete('Authorization');
      },
      params: {
        client_id: apiKey
      }
    }).then(response => {
      success(response.body)
    })
  }

  return {
    getImageOfDay,
    getImage
  }
}

//sgpLdF0aSno