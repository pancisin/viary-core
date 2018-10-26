import ChangeApi from './change.api';
import DiaryApi from './diary.api';
import NoteApi from './note.api';
import WeatherApi from './weather.api';

export default {
  destroyDatabase () {
    ChangeApi().destroyDatabase();
    DiaryApi().destroyDatabase();
    NoteApi().destroyDatabase();
    WeatherApi().destroyDatabase();
  }
}