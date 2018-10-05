<template>
  <div id="app">
    <div class="container">
      <auth-wrapper>
        <diary-module baseUrl="http://localhost:8180" />
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

