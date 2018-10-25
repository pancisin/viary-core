const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const appId = '8a599ad2eabe8cea39f227601083f799';
import Vue from 'vue'
export default () => {
  const getWeatherData = cityName => {
    return Vue.http.get(`${WEATHER_API_URL}/weather`, {
      before (request) {
        request.headers.delete('Authorization');
      },
      params: {
        appid: appId,
        q: cityName
      }
    }).then(response => {
      return Promise.resolve(response.body)
    })
  }

  const getForecastData = cityName => {
    return Vue.http.get(`${WEATHER_API_URL}/forecast`, {
      before (request) {
        request.headers.delete('Authorization');
      },
      params: {
        appid: appId,
        q: cityName
      }
    }).then(response => {
      return Promise.resolve(response.body)
    })
  }

  return {
    getWeatherData,
    getForecastData
  }
}