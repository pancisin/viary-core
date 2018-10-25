import Vue from 'vue'
export default (baseUrl) => {
  const DIARY_API_URL = `${baseUrl}/api/v1/diary`;
  const ME_API_URL = `${baseUrl}/api/v1/user/me`;

  const getDiaries = _ => {
    return Vue.http.get(`${ME_API_URL}/diary`).then(response => {
      return Promise.resolve(response.body);
    });
  }

  const postDiary = diary => {
    return Vue.http.post(`${ME_API_URL}/diary`, diary).then(response => {
      return Promise.resolve(response.body);
    })
  }

  const putDiary = (diaryId, diary) => {
    return Vue.http.put(`${DIARY_API_URL}/${diaryId}`, diary).then(response => {
      return Promise.resolve(response.body);
    })
  }

  const getDiary = diaryId => {
    return Vue.http.get(`${DIARY_API_URL}/${diaryId}`).then(response => {
      return Promise.resolve(response.body);
    })
  }

  const getDays = (diaryId, filter) => {
    return Vue.http.get(`${DIARY_API_URL}/${diaryId}/day`, {
      params: {
        from: filter.from || null,
        to: filter.to || null
      }
    }).then(response => {
      return Promise.resolve(response.body)
    })
  }

  const postNote = (diaryId, { ordinal, year, content }) => {
    return Vue.http.post(`${DIARY_API_URL}/${diaryId}/day/${ordinal}/${year}/note`, {
      content
    }).then(response => {
      return Promise.resolve(response.body)
    })
  }

  return {
    getDiaries,
    postDiary,
    putDiary,
    getDiary,
    getDays,
    postNote
  }
}