const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const appId = '8a599ad2eabe8cea39f227601083f799';

export default (instance) => {
  const getWeatherData = (cityName, success) => {
    instance.$http.get(`${WEATHER_API_URL}/weather`, {
      before (request) {
        request.headers.delete('Authorization');
      },
      params: {
        appid: appId,
        q: cityName
      }
    }).then(response => {
      success(response.body)
    }).catch(err => {
      console.error(err);
    })
  }

  const getForecastData = (cityName, success, error) => {
    instance.$http.get(`${WEATHER_API_URL}/forecast`, {
      before (request) {
        request.headers.delete('Authorization');
      },
      params: {
        appid: appId,
        q: cityName
      }
    }).then(response => {
      success(response.body)
    }).catch(err => {
      if (error) {
        error(err)
        console.error(err)
      }
    })
  }

  return {
    getWeatherData,
    getForecastData
  }
}