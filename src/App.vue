<template>
  <div id="app">
    <div class="container">
      <auth-wrapper>
        <diary-module 
          baseUrl="http://localhost:8180" 
          :useLocalDatabase="useLocalDatabase" />
      </auth-wrapper>
    </div>
  </div>
</template>

<script>
import { DiaryModule } from './modules';

export default {
  name: 'app',
  components: {
    DiaryModule
  },
  data () {
    return {
      offlineMode: false
    }
  },
  mounted () {
    const updateOnlineStatus = e => {
      // this.offlineMode = e.type.toLowerCase() === 'offline';
    }

    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  },
  methods: {
    useLocalDatabase () {
      return this.offlineMode;
    }
  }
}
</script>

