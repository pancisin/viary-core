<template>
  <div id="app">
    <auth-wrapper>
      <diary-module baseUrl="http://diary.convene.sk" />
    </auth-wrapper>
  </div>
</template>

<script>
import Runner from './components/Runner'
import AuthWrapper from './components/AuthWrapper'
import { DiaryModule } from './modules'

export default {
  name: 'app',
  components: {
    AuthWrapper,
    Runner,
    DiaryModule
  }
}
</script>

