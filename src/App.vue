<template>
  <div id="app">
    <div class="container">
      <auth-wrapper>
        <diary-module baseUrl="http://diary.convene.sk" />
      </auth-wrapper>
    </div>
  </div>
</template>

<script>
import AuthWrapper from './components/internal/AuthWrapper'
import { DiaryModule } from './modules'

export default {
  name: 'app',
  components: {
    AuthWrapper,
    DiaryModule
  }
}
</script>

