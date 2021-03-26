
<template>
  <div>
    <b-row class="mt-4 justify-content-md-center">
      <b-col
        md="6"
        cols="12"
      >
        <p>
          {{ $t('yourDownloadWillStartShortlyIfNotClickHere') }}
        </p>
        <b-button
          @click="downloadPdf"
        >
          {{ $t('downloadPDF') }}
        </b-button>
      </b-col>
    </b-row>
    <div
      v-show="false"
      ref="pdf-content"
    >
      <div style="width: 595px;height: 842px;font-family: &quot;Adelle Sans&quot;, Helvetica, sans-serif">
        <div style="height: 100px; width: 595px;background-color: #24346c !important;padding: 0px 40px;">
          <a href="https://www.grv3.com/">
            <img
              src="/logo.png"
              alt="logo"
              style="width: 130px;height: 42px;margin-top: 29px;"
            >
          </a>
        </div>
        <div style="width: 595px;padding: 24px;word-wrap: break-word;">
          <div>GR:&nbsp; {{ issue.name }}</div>
          <div>Issue&nbsp;Name:&nbsp;{{ issueName }}</div>
          <div>Printed&nbsp;at:&nbsp;{{ $moment().format('DD MMM YYYY') }}</div>
          <div>Issue&nbsp;created:&nbsp;{{ $moment(issue.createdAt).format('DD MMM YYYY') }}</div>
          <div>Category:&nbsp;{{ $t(findData(dataTypes.issueCategory)) }}</div>
          <div>Sub&nbsp;categories:&nbsp;{{ categories }}</div>
          <div>What&nbsp;happened:&nbsp;{{ findData(dataTypes.whatHappened) }}</div>
          <div>What&nbsp;was&nbsp;expected:&nbsp;{{ findData(dataTypes.expectations) }}</div>
          <div>Goals:&nbsp;{{ findData(dataTypes.goals) }}</div>
          <div>Conversation:&nbsp;</div>
          <div>Resolution:&nbsp;{{ $moment(issue.resolvedAt).format('DD MMM YYYY') }}</div>
          <div>Agreed&nbsp;by&nbsp;the&nbsp;client&nbsp;on:&nbsp;</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';
import jsPDF from 'jspdf';
import {dataTypes} from '@/constants/data-types.js';

export default {

  async asyncData({store, params}) {
    await store.dispatch('issue/fetch', params.id);
  },

  data: () => ({dataTypes}),

  computed: {
    ...mapGetters({
      issue: 'issue/issue',
      issueData: 'issue/issueData',
      siteType: 'site/type'
    }),
    issueName() {
      const responder = this.issue.parties
        .find(party => party.type === 'responder');
      if (responder && this.siteType === 'complaints') {
        return responder.name;
      } else {
        return this.issue.name;
      }
    },
    categories() {
      const categories = this.findData(dataTypes.issueSubCategory);
      if (categories.length) {
        return categories.split(',').map(cat => this.$t(cat)).join(', ');
      } else {
        return categories;
      }
    }
  },

  async mounted() {
    try {
      await this.downloadPdf();
      setTimeout(() => window.close(), 0);
    } catch (err) {
      console.error(err);
    }
  },

  methods: {
    findData(typeId) {
      const data = this.issueData.find(issueData => {
        return issueData.type.id === typeId;
      });
      if (data) return data.value;
      else return '';
    },
    downloadPdf() {
      return new Promise(resolve => {
        const pdf = new jsPDF('p', 'px', [595, 842]);
        const content = this.$refs['pdf-content'].innerHTML;
        pdf.setFontSize(11);
        pdf.html(content, {
          callback: pdf => pdf.save(
            `Issue_${this.issue.id}_${Date.now()}.pdf`,
            {returnPromise: true}
          ).then(resolve)
        });
      });
    }
  }
};
</script>

<style scoped>
.btn-pdf-download {
  margin-left: 20px;
}
</style>
