import { Interval, DateTime } from 'luxon';
import PouchDB from 'pouchdb';

export default _ => {
  var db = new PouchDB('weather_db');

  const storeWeatherData = data => {
    const result = [];
    for (let d in data) {
      result.push({
        ...data[d],
        _id: d
      })
    }

    return db.bulkDocs(result).then(response => {
      return Promise.resolve(response.rows)
      // return response.rows;
    })
  }

  const getForecastData = (cityName, startDate) => {

    const date = DateTime.fromSQL(startDate);
    const keys = Array.from({ length: 5 }, (v, i) => i).map(i => {
      return date.plus({ days: i }).toSQLDate()
    })

    return db.allDocs({
      include_docs: true,
      keys
    }).then(response => {
      if (response.rows.some(r => r.error != null)) {
        return Promise.reject()
      }

      return Promise.resolve(response.rows.map(r => r.doc))
    })
  }

  return {
    storeWeatherData,
    getForecastData
  };
};
