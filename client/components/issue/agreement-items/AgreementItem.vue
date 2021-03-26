

<template>
  <b-card
    no-body
    class="pointer"
    :class="{'grey-bg': hover}"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <b-card-body>
      <div
        class="position-absolute top-icons"
      >
        <b-icon
          v-if="hover"
          icon="pencil-square"
        />
        <b-icon
          v-if="false"
          icon="bell"
        />
      </div>
      <p>
        {{ issueData.value }}
      </p>
    </b-card-body>

    <b-card-body class="divider">
      <agreement-item-status
        :issue-data-id="issueData.id"
        :issue-id="issueId"
        :statuses="issueData.statuses"
      />
    </b-card-body>

    <b-card-body class="divider text-center">
      <div>
        12 Comments
      </div>
      <div class="mt-2">
        <b-button
          class="w-100 comment-btn"
          variant="outline-primary"
        >
          Discussion
        </b-button>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>

export default {

  props: {
    issueId: {type: Number, required: true},
    issueData: {type: Object, required: true}
  },

  data() {
    return {
      hover: false
    };
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/modules/colors";

$grey: #80808014;

.card-body {
  background: none;
  font-weight: bold;
  padding: 10px;
  padding-top: 16px;
}

.divider {
  border-top: 1px solid $color_accent;
}

.comment-btn {
  border-radius: 0;
}

.top-icons {
  background-color: $grey;
  right: 10px;
}

.grey-bg {
  background-color: $grey;
}

.pointer {
  cursor: pointer;
}
</style>
