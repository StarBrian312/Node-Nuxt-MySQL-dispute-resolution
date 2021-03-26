<template>
  <div class="d-flex flex-row justify-content-center">
    <div class="wrapper">
      <b-row
        class="w-100"
        no-gutters
      >
        <b-col
          v-for="issue in issues"
          :key="issue.id"
          cols="12"
          sm="6"
          lg="3"
        >
          <b-card
            no-body
          >
            <template #header>
              <h4 class="issue-name">
                {{ issue.name }} (#{{ issue.id }})
              </h4>
            </template>

            <b-list-group flush>
              <b-list-group-item>
                <strong class="mr-2 text-uppercase label-info">
                  {{ $t('recordedAt') }}:
                </strong>
                <span />
                {{ issue.recordedAt }}
              </b-list-group-item>
              <b-list-group-item
                :class="{
                  'red-text': $moment(issue.lastActivity)
                    .subtract(7, 'days')
                    .isAfter($moment())
                }"
              >
                <strong class="mr-2 text-uppercase label-info">
                  {{ $t('lastActivity') }}:
                </strong>
                {{ issue.lastActivity }}
              </b-list-group-item>
              <b-list-group-item>
                <strong class="mr-2 text-uppercase label-info">
                  {{ $t('resolved') }}:
                </strong>

                <span v-if="issue.resolvedAt">
                  {{ issue.resolvedAt }}
                </span>
                <span v-else>
                  {{ $t('notYet') }}
                </span>
              </b-list-group-item>
            </b-list-group>

            <b-card-body class="pt-0 issue-actions">
              <b-button
                v-if="!issue.resolvedAt"
                variant="primary"
                :to="`/issue/${issue.id}`"
              >
                {{ $t('viewComplaint') }}
              </b-button>
              <b-button
                v-else
                variant="link"
                class="btn-pdf-download"
                :href="`/issue/${issue.id}/download-pdf`"
                target="_blank"
              >
                {{ $t('downloadPDF') }}
              </b-button>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    issues: {type: Array, default: () => ([])}
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/modules/colors";

.card {
  color: $color_primary;
}

.issue-name {
  margin: 4px;
  font-size: 16px;
  font-weight: bold;
}

.red-text {
  color: red;
}

.wrapper {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: left;
}

.wrapper .card {
  margin: 10px;
}

.list-group-flush > .list-group-item {
    border-width: 0 0 1px;
    border: none;
    padding: 8px 16px;
    font-size: 12px;
}
.card-header{
  background: none;
  font-weight: bold;
  border-bottom: 1px solid $color_accent;
  padding-top: 16px;
}
.card > .list-group {
  padding: 12px 4px 12px;
  border: none;
}

.label-info{
  min-width: 100px;
    display: inline-block;
    font-size: 12px;
}

.issue-actions{
  display: flex;
}
</style>
