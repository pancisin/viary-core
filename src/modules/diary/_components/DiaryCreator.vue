<template>
  <div class="row p-10 d-flex ai-c" style="height: 100vh">
    <menubar-slot>
      <navigator-link to="/" v-if="dismissable">
          <i class="lnr lnr-cross fsz-xl"></i>
      </navigator-link>
    </menubar-slot>

    <div class="col-md-8 col-lg-6 offset-md-2 offset-lg-3">
      <!-- <div class="text-right" v-if="dismissable">
        <navigator-link to="/">
          <i class="lnr lnr-cross fsz-xl"></i>
        </navigator-link>
      </div> -->

      <create-diary-form />
    </div>
  </div>
</template>

<script>
import { CreateDiaryForm } from './forms';
import MenubarSlot from '@/components/MenubarSlot';
export default {
  name: 'diary-creator',
  props: {
    dismissable: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  components: {
    CreateDiaryForm,
    MenubarSlot
  }
}
</script>
