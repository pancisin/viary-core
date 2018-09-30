<template>
  <div class="diary-info d-flex jc-sb ai-c">
    <span>{{ scopedDay.weekNumber }}. týždeň {{ scopedDay.year }}</span>
    
    <dropdown
      class="notifications">
      <span slot="link">
        <span class="lnr lnr-cog fsz-xl"></span>
      </span>

      <li>
        <ul class="ovY-a pos-r scrollable lis-n p-0 m-0 fsz-sm">
          <li>
            <a class="peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100">
              <div class="peer mR-15">
                <img
                  class="w-3r bdrs-50p"
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  alt="">
              </div>
              <div class="peer peer-greed">
                <span>
                  <span class="fw-500">{{ user != null ? user.display_name : '' }}</span>
                  <p class="c-grey-600 m-0">{{ scopedDiary.name }}</p>
                </span>
                <!-- <p class="m-0">
                  <small class="fsz-xs">5 mins ago</small>
                </p> -->
              </div>
            </a>
          </li>
        </ul>
      </li>
      <dropdown-item>
        <!-- <i class="fa fa-shopping-basket"></i> -->
        Purchase
      </dropdown-item>
      <dropdown-item @click="displayDiaryOptionsModal = true">
        <!-- <i class="fa fa-cog"></i> -->
        Options
      </dropdown-item>
      <dropdown-item @click="displaySwitchDiaryModal = true">
        <!-- <i class="fa fa-switch"></i> -->
        Switch diary
      </dropdown-item>
      <dropdown-item class="bdT" @click="logoutNow">
        Logout 
      </dropdown-item>
    </dropdown>

    <modal :show.sync="displaySwitchDiaryModal">
      <span slot="header">Switch diary</span>
      <div slot="body">
        <diary-switch @switched="switchedDiary" />
      </div>
    </modal>

    <modal :show.sync="displayDiaryOptionsModal">
      <span slot="header">Edit diary</span>
      <div slot="body">
        <diary-editor :diary="scopedDiary" />

        <h4>Appearance</h4>

        <div class="d-flex flex-row flex-wrap">
          <a 
            v-for="(theme, idx) in themes" 
            :key="idx" 
            style="flex: 0 0 25%"
            class="img-thumbnail"
            @click="selectTheme(theme.id)">

            <img :src="theme.imageUrl" class="w-100p h-100p">
          </a>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import { Dropdown, DropdownItem } from '@/components/elements';
import { mapGetters, mapActions } from 'vuex';
import { Modal } from '@/components/elements';
import DiarySwitch from './DiarySwitch';
import DiaryEditor from './DiaryEditor';

// import gravatar from 'gravatar';

export default {
  data () {
    return {
      displaySwitchDiaryModal: false,
      displayDiaryOptionsModal: false
    }
  },
  components: {
    Modal,
    DiarySwitch,
    Dropdown, 
    DropdownItem,
    DiaryEditor
  },
  computed: {
    ...mapGetters('$_diary', ['scopedDay', 'scopedDiary']),
    ...mapGetters('$_auth', ['user']),
    ...mapGetters('$_settings', ['themes']),
    profilePic () {
      return ""
      // return gravatar.url(this.user.email)
    }
  },
  methods: {
    ...mapActions('$_auth', ['logout']),
    ...mapActions('$_settings', ['selectTheme']),
    logoutNow() {
      this.logout().then(() => {
        this.$store.dispatch('$_diary/flushDiaries')
        this.$router.push({ name: 'signin' })
      })
    },
    switchedDiary () {
      this.displaySwitchDiaryModal = false;
    }
  }
}
</script>
