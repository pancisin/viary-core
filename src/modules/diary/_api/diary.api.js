import Vue from 'vue'
export default (baseUrl) => {
  const DIARY_API_URL = `${baseUrl}/api/v1/diary`;
  const ME_API_URL = `${baseUrl}/api/v1/user/me`;

  const getDiaries = (success) => {
    return new Promise(resolve => {
      Vue.http.get(`${ME_API_URL}/diary`).then(response => {
        if (success) {
          success(response.body);
        }
        
        resolve(response.body);
      })
    })
  }

  const postDiary = (diary, success) => {
    Vue.http.post(`${ME_API_URL}/diary`, diary).then(response => {
      success(response.body);
    })
  }

  const putDiary = (diaryId, diary, success) => {
    Vue.http.put(`${DIARY_API_URL}/${diaryId}`, diary).then(response => {
      success(response.body);
    })
  }

  const getDiary = (diaryId, success) => {
    Vue.http.get(`${DIARY_API_URL}/${diaryId}`).then(response => {
      success(response.body);
    })
  }

  const getDays = (diaryId, filter, success) => {
    Vue.http.get(`${DIARY_API_URL}/${diaryId}/day`, {
      params: {
        from: filter.from || null,
        to: filter.to || null
      }
    }).then(response => {
      success(response.body)
    })
  }

  const postNote = (diaryId, { ordinal, year, content }, success) => {
    Vue.http.post(`${DIARY_API_URL}/${diaryId}/day/${ordinal}/${year}/note`, {
      content
    }).then(response => {
      success(response.body)
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