

<template>
  <div>
    <div>
      <!-- action bar -->
      <div class="d-flex justify-content-end align-items-center mb-2">
        <p class="hover-primary mb-0">
          {{ $t('recordOfflineComplaint') }}
        </p>

        <span class="px-3">|</span>

        <p
          class="hover-primary mb-0"
          @click="opened=!opened"
        >
          {{ opened ? $t('snapshot.hide') : $t('snapshot.show') }}
        </p>

        <span class="px-3"> | </span>

        <b-overlay
          :show="loading"
          rounded
          opacity="0.7"
          spinner-small
          spinner-variant="primary"
          class="d-inline-block"
        >
          <b-button
            ref="button"
            :disabled="loading"
            variant="text"
            class="hover-primary"
            @click="downloadPDF"
          >
            {{ $t('downloadBoardRreport') }}
          </b-button>
        </b-overlay>
      </div>
      <!-- chart box -->
      <b-card
        v-if="opened"
        class="mh-500"
      >
        <b-row>
          <b-col
            cols="12"
            md="3"
          >
            <highchart
              :key="newKey"
              redraw
              :options="chartOptions"
              :update="['options', 'options.series']"
            />
          </b-col>
          <b-col
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <div>
              <h4>{{ $t('inProgressOnTime') }}</h4>
              <p>{{ $t('under20DaysOld') }}</p>
              <p>{{ series.getting }}</p>
            </div>
          </b-col>
          <b-col
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <div>
              <h4>{{ $t('gettingLate') }}</h4>
              <p>{{ $t('20orMoreDaysOld') }}</p>
              <p>{{ series.opened }}</p>
            </div>
          </b-col>
          <b-col
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <div>
              <h4>{{ $t("closed") }}</h4>
              <p>&nbsp;</p>
              <p>{{ series.closed }}</p>
            </div>
          </b-col>
        </b-row>
      </b-card>
    </div>
    <div
      v-show="false"
      id="chartDownload"
      class="position-absolute"
    />
  </div>
</template>
<script>
import {mapGetters} from 'vuex';

import Highcharts from 'highcharts';

export default {
  data() {
    return {
      opened: true,
      loading: false,
      newKey: 'newKey'
    };
  },
  computed: {
    ...mapGetters({
      orgIssues: 'org/issues/data'
    }),
    series: function() {
      const closedArr = this.orgIssues.filter(el => el.closedAt > 0);
      const openedCnt = this.orgIssues.length - closedArr.length;
      const gettingArr = this.orgIssues.filter(el => !el.closedAt && this.$moment().diff(this.$moment(el.createdAt), 'days') >= 20);
      return {
        closed: closedArr.length,
        opened: openedCnt,
        getting: gettingArr.length
      };
    },
    chartOptions: function() {
      return {
        chart: {
          type: 'pie',
          height: 200
        },
        exporting: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        title: {
          text: ''
        },
        colors: ['#00FF00', '#0000FF', '#FF0000'],
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: false,
              format: `<b>{point.name}</b>: {point.y}`
            },
            size: 100,
            showInLegend: true
          }
        },
        series: [
          {
            data: [
              {name: this.$t('closed'), y: this.series['closed']},
              {name: this.$t('inProgress'), y: this.series['opened']},
              {name: this.$t('gettingLate'), y: this.series['getting']}
            ]
          }
        ]
      };
    }
  },
  watch: {
    chartOptions: {
      deap: true,
      handler() {
        this.newKey = +new Date();
      }
    }

  },
  methods: {
    downloadPDF() {
      this.loading = true;
      const optionWithLabel = JSON.parse(JSON.stringify(this.chartOptions));
      optionWithLabel.plotOptions.pie.dataLabels.enabled = true;
      const chart = Highcharts.chart('chartDownload', optionWithLabel);
      chart.exportChart({
        type: 'application/pdf',
        filename: 'issue_' + (+new Date())
      });
      this.loading = false;
    }
  }
};
</script>
<style scoped>
.mh-500{
  max-height: 500px;
}
</style>
