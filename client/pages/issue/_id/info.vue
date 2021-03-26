<template>
  <div>
    <issue-intro
      :title="$t('infoStepIntroTitle')"
      :desc="$t('infoStepIntroDesc')"
    />
    <div class="wrapper-content-issue">
      <gr-select
        :title="$t('issueSectorTitle')"
        :issue-id="+$route.params.id"
        :type-id="dataTypes.issueSector"
        :options="sectorOptions"
        :validations="{required}"
      />

      <gr-select
        v-if="getIssueData(dataTypes.issueSector)"
        :title="$t('issueCategoryTitle')"
        :issue-id="+$route.params.id"
        :type-id="dataTypes.issueCategory"
        :options="categoryOptions"
        :validations="{required}"
        :disabled="!!issueSubCategory"
      />

      <gr-checkbox-group
        v-if="issueCategory"
        :title="$t('issueSubCategoryTitle')"
        :issue-id="+$route.params.id"
        :type-id="dataTypes.issueSubCategory"
        :options="subCategoryOptions"
        :validations="{required}"
        stacked
      />

      <gr-textarea
        v-if="getIssueData(dataTypes.issueSubCategory)"
        :title="$t('whatHappenedTitle')"
        :issue-id="+$route.params.id"
        :type-id="dataTypes.whatHappened"
        :validations="{required, maxChars: maxLength(250)}"
      />

      <gr-textarea
        v-if="getIssueData(dataTypes.whatHappened)"
        :title="$t('expectationsTitle')"
        :issue-id="+$route.params.id"
        :type-id="dataTypes.expectations"
        :validations="{required, maxChars: maxLength(250)}"
      />
    </div>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';
import {dataTypes} from '@/constants/data-types.js';
import {required, maxLength} from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      dataTypes,
      required,
      maxLength,
      cats: [
        {
          key: 'advice',
          children: [
            {
              key: 'notBestInterestAdvice'
            },
            {
              key: 'inappropriateAdvice'
            },
            {
              key: 'insufficientAdvice'
            }
          ]

        },
        {
          key: 'productCharges',
          children: [
            {
              key: 'badProductInformation'
            }, {
              key: 'incorrectCharges'
            }
          ]
        },
        {
          key: 'performance',
          children: [
            {
              key: 'inappropriateDecisions'
            }, {

              key: 'incorrectTransactions'
            },
            {
              key: 'unauthorisedTransactions'
            },
            {
              key: 'instructionsNotFollowed'
            },
            {
              key: 'delayedDecisions'
            }
          ]
        },
        {
          key: 'behaviour',
          children: [
            {
              key: 'impoliteness'
            },
            {
              key: 'bullying'
            },
            {
              key: 'sexualHarassment'
            },
            {
              key: 'confidencialityBreach'
            }
          ]
        },
        {
          key: 'other',
          children: [
            {
              key: 'financialDifficulty'
            },
            {
              key: 'noneOfTheAbove'
            }
          ]
        }

      ],
      sectors: [
        'investmentsAndFinancialAdvice',
        'creditFinanceAndLoan',
        'insurance',
        'bankingDepositsAndPayments',
        'superannuation'
      ]
    };
  },
  computed: {
    ...mapGetters({
      issueCategory: 'issue/issueCategory',
      issueSubCategory: 'issue/issueSubCategory'
    }),
    sectorOptions() {
      return [
        {
          value: '',
          text: this.$t('selectOne'),
          disabled: true
        },
        ...this.mapOptions(this.sectors)
      ];
    },
    categoryOptions() {
      return [
        {
          value: '',
          text: this.$t('selectOne'),
          disabled: true
        },
        ...this.mapOptions([
          'advice',
          'productCharges',
          'performance',
          'behaviour',
          'other'
        ])
      ];
    },
    subCategoryOptions() {
      if (
        this.issueCategory?.value === 'advice'
      ) {
        return this.mapOptions([
          'notBestInterestAdvice',
          'inappropriateAdvice',
          'insufficientAdvice'
        ]);
      } else if (
        this.issueCategory?.value === 'productCharges'
      ) {
        return this.mapOptions([
          'badProductInformation',
          'incorrectCharges'
        ]);
      } else if (
        this.issueCategory?.value === 'performance'
      ) {
        return this.mapOptions([
          'inappropriateDecisions',
          'incorrectTransactions',
          'unauthorisedTransactions',
          'delayedDecisions',
          'instructionsNotFollowed',
          'disputeLiability'
        ]);
      } else if (
        this.issueCategory?.value === 'behaviour'
      ) {
        return this.mapOptions([
          'impoliteness',
          'bullying',
          'sexualHarassment'
        ]);
      } else if (
        this.issueCategory?.value === 'other'
      ) {
        return this.mapOptions([
          'financialDifficulty',
          'noneOfTheAbove'
        ]);
      } else {
        return [];
      }
    }
  },
  methods: {
    mapOptions(options) {
      return options.map(t => ({value: t, text: this.$t(t)}));
    },
    getIssueData(typeId) {
      return this.$store.state.issue.issueData.find(
        issueData => issueData.type.id === typeId
      );
    }
  }
};
</script>
