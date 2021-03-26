
<template>
  <div>
    <div>
      <issue-intro
        :title="$t('resolutionStepIntroTitle')"
        :desc="$t('resolutionStepIntroDesc')"
      />
      <div class="wrapper-content-issue">
        <gr-select
          v-if="party.type === 'responder'"
          :title="$t('resolutionTypeTitle')"
          :description="$t('resolutionTypeDescription')"
          :issue-id="+$route.params.id"
          :type-id="dataTypes.resolutionType"
          :options="[
            {
              value: '',
              text: $t('selectOne'),
              disabled: true
            },
            ...mapOptions([
              'refund',
              'partialRefund',
              'freeFutureServices',
              'reducedFutureServices',
              'compromise',
              'otherCompensation',
              'noCompensation',
              'escalateToMediation',
              'escalateToTribunal',
              'escalateToCourt'
            ])
          ]"
          :validations="{required}"
        />

        <gr-textarea
          v-if="party.type === 'responder' && !resolutionConfirmed && resolutionType"
          :title="$t('resolutionTitle')"
          :issue-id="+$route.params.id"
          :type-id="dataTypes.resolution"
          :validations="{required}"
        />

        <div
          v-if="party.type === 'participant' && !resolution && !resolutionConfirmed"
          class="mb-4"
        >
          {{ $t('waitForReponderToEnterResolution') }}
        </div>

        <div
          v-if="party.type === 'participant' && resolution && !resolutionConfirmed"
          class="mb-4"
        >
          {{ resolution.value }}
        </div>

        <gr-checkbox
          v-if="party.type === 'participant' && resolution && !resolutionConfirmed"

          :title="$t('iAgreeToThisResolution')"
          :issue-id="+$route.params.id"
          :type-id="dataTypes.resolutionConfirmed"
          :validations="{required}"
        />
        <div
          v-if="resolution && resolutionConfirmed"
          class="mb-4"
        >
          {{ resolution.value }}
        </div>

        <gr-checkbox
          v-else-if="party.type === 'participant' && resolutionConfirmed"
          :title="`${$t('youHaveAgreedToThisResolution')} ${$moment(resolutionConfirmed.createdAt).format('LL')}`"
          :issue-id="+$route.params.id"
          :type-id="dataTypes.resolutionConfirmed"
          :validations="{required}"
          :disabled="true"
        />

        <gr-checkbox
          v-else-if="party.type === 'responder' && resolutionConfirmed"
          :title="`${party.name} ${$t('agreedToThisResolutionOn')} ${$moment(resolutionConfirmed.createdAt).format('LL')}`"
          :issue-id="+$route.params.id"
          :type-id="dataTypes.resolutionConfirmed"
          :validations="{required}"
          :disabled="true"
        />
      </div>
    </div>
  </div>
</template>

<script>

import {dataTypes} from '@/constants/data-types.js';
import {required} from 'vuelidate/lib/validators';
import {mapGetters} from 'vuex';

export default {
  data() {
    return {dataTypes, required};
  },
  computed: {
    ...mapGetters({
      party: 'issue/party',
      issueData: 'issue/issueData'
    }),
    resolution() {
      return this.issueData.find(issueData => (
        issueData.type.id === this.dataTypes.resolution
      ));
    },
    resolutionType() {
      return this.issueData.find(issueData => (
        issueData.type.id === this.dataTypes.resolutionType
      ));
    },
    resolutionConfirmed() {
      return this.issueData.find(issueData => (
        issueData.type.id === this.dataTypes.resolutionConfirmed
      ));
    }
  },
  methods: {
    mapOptions(options) {
      return options.map(t => ({value: t, text: this.$t(t)}));
    }
  }
};
</script>
