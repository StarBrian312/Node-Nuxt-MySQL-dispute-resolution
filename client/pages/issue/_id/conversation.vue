
<template>
  <div>
    <div>
      <div>
        <issue-intro
          :title="$t('conversationStepIntroTitle')"
          :desc="$t('conversationStepIntroDesc')"
        />

        <div class="d-flex flex-row justify-content-center align-items-center">
          <b-button
            v-if="!showFrom"
            size="lg"
            class="dashed-button d-flex flex-row justify-content-center align-items-center"
            @click="showFrom = true"
          >
            <b-icon icon="plus-circle-fill" />
            <span class="ml-3"> {{ $t("newAgreementItem") }} </span>
          </b-button>
        </div>

        <gr-textarea
          v-if="showFrom"
          :title="$t('agreementItemTitle')"
          :issue-id="+$route.params.id"
          :type-id="dataTypes.agreementItem"
          :validations="{required, maxChars: maxLength(250)}"
          :bind="false"
        />

        <b-card-group
          columns
          class="mt-4"
        >
          <agreement-item
            v-for="issueData in agreementItems"
            :key="issueData.id"
            :issue-id="+$route.params.id"
            :issue-data="issueData"
            @click.native="openedAgreementId = issueData.id"
          />
        </b-card-group>

        <b-modal
          id="modal"
          title="BootstrapVue"
          :visible="!!openedAgreementId"
          hide-backdrop
          hide-footer
          hide-header
          centered
          size="lg"
          @close="openedAgreementId = null"
          @hidden="openedAgreementId = null"
        >
          <agreement-item-edit
            v-if="openedAgreementId"
            :issue-id="+$route.params.id"
            :issue-data="openedAgreementItem"
          />
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>

import {dataTypes} from '@/constants/data-types.js';
import {required, maxLength} from 'vuelidate/lib/validators';
import {mapGetters} from 'vuex';

export default {

  data: () => ({
    dataTypes,
    required,
    maxLength,
    openedAgreementId: null,
    showFrom: false
  }),

  computed: {
    ...mapGetters({
      issueData: 'issue/issueData'
    }),
    agreementItems() {
      return this.issueData.filter(issueData => {
        return issueData.type.id === dataTypes.agreementItem;
      });
    },
    openedAgreementItem() {
      return this.issueData.find(issueData => {
        return issueData.id === this.openedAgreementId;
      });
    }
  },

  watch: {
    agreementItems() {
      this.showFrom = !this.agreementItems.length;
    }
  },

  mounted() {
    this.showFrom = !this.agreementItems.length;
  }
};
</script>
