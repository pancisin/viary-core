export default (baseUrl, instance) => {
  const DIARY_API_URL = `${baseUrl}/api/v1/diary`;
  const ME_API_URL = `${baseUrl}/api/v1/user/me`;

  const getDiaries = (success) => {
    instance.$http.get(`${ME_API_URL}/diary`).then(response => {
      success(response.body);
    })
  }

  const postDiary = (diary, success) => {
    instance.$http.post(`${ME_API_URL}/diary`, diary).then(response => {
      success(response.body);
    })
  }

  const getDiary = (diaryId, success) => {
    instance.$http.get(`${DIARY_API_URL}/${diaryId}`).then(response => {
      success(response.body);
    })
  }

  const getDays = (diaryId, filter, success) => {
    instance.$http.get(`${DIARY_API_URL}/${diaryId}/day`, {
      params: {
        from: filter.from || null,
        to: filter.to || null
      }
    }).then(response => {
      success(response.body)
    })
  }

  const postDay = (diaryId, { date_number, year, content }, success) => {
    instance.$http.post(`${DIARY_API_URL}/${diaryId}/day/${date_number}/${year}`, {
      content
    }).then(response => {
      success(response.body)
    })
  }

  return {
    getDiaries,
    postDiary,
    getDiary,
    getDays,
    postDay
  }
}