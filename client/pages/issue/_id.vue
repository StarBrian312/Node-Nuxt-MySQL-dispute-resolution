<template>
  <div>
    <b-row class="issue-heading">
      <h4>#{{ issueParty.issue }} {{ issueParty.name }}</h4>
      <nuxt-link
        to="/"
        class="btn-leave"
      >
        <b-icon icon="arrow-bar-left" />
        {{ $t('leaveIssue') }}
      </nuxt-link>
    </b-row>
    <b-row
      class="issue-row"
    >
      <b-col
        cols="12 p-0"
        md="4"
        lg="2"
        class="issue-menu"
      >
        <ul class="list">
          <li
            v-for="step in steps"
            :key="step.id"
            class="item"
          >
            <div
              class="case-step"
              :class="{ active: currentStep.name === step.name }"
            >
              <IssueStepState
                :completed="step.state.completed"
                :selected="currentStep.name === step.name"
                :enabled="step.state.enabled"
              />
              <b-button
                variant="link"
                :disabled="!step.state.enabled"
                @click="selectStep(step)"
              >
                {{ $t(step.name) }}
              </b-button>
            </div>
            <ul
              v-if="step.steps.length"
              class="list"
            >
              <li
                v-for="childStep in step.steps"
                :key="childStep.id"
                class="item"
              >
                <div class="case-step">
                  <IssueStepState
                    :completed="childStep.state.completed"
                    :selected="currentStep.name === childStep.name"
                    :enable="childStep.state.enabled"
                  />
                  <b-button
                    variant="link"
                    :disabled="!childStep.state.enabled"
                    @click="selectStep(childStep)"
                  >
                    {{ $t(childStep.name) }}
                  </b-button>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </b-col>
      <b-col
        cols="12"
        md="8"
        lg="10"
        class="issue-content"
      >
        <NuxtChild />

        <div class="btn-group-issue">
          <b-button
            v-if="prevStep"
            variant="outline-warning"
            size="lg"
            :disabled="!prevStep.state.enabled || ($nuxt.$loading && $nuxt.$loading.show)"
            @click="prev"
          >
            <b-icon
              v-if="$nuxt.$loading && $nuxt.$loading.show"
              icon="three-dots"
              animation="cylon"
            />
            <span v-else>
              <b-icon
                icon="arrow-left-short"
              />
              {{ $t('prev') }}
            </span>
          </b-button>

          <b-button
            v-if="nextStep"
            variant="outline-warning"
            size="lg"
            :disabled="!nextStep.state.enabled || ($nuxt.$loading && $nuxt.$loading.show)"
            @click="next"
          >
            <b-icon
              v-if="$nuxt.$loading && $nuxt.$loading.show"
              icon="three-dots"
              animation="cylon"
            />
            <span v-else>
              {{ $t('next') }}
              <b-icon
                icon="arrow-right-short"
              />
            </span>
          </b-button>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>

import {mapGetters, mapMutations} from 'vuex';

export default {
  async asyncData({params, store}) {
    await store.dispatch('issue/fetch', params.id);
    store.commit('issue/initStep');
  },
  computed: {
    ...mapGetters({
      steps: 'issue/steps',
      currentStep: 'issue/currentStep',
      issueData: 'issue/issueData',
      issueParty: 'issue/party'
    }),
    currentStepIndex() {
      return this.steps.findIndex(
        step => step.id === this.currentStep.id
      );
    },
    nextStep() {
      return this.steps[this.currentStepIndex + 1];
    },
    prevStep() {
      return this.steps[this.currentStepIndex - 1];
    }
  },
  mounted() {
    this.navToCurrStep();
  },
  methods: {
    ...mapMutations({
      setStep: 'issue/currentStep'
    }),
    navToCurrStep() {
      this.$router.push(
        `/issue/${this.$route.params.id}/${this.currentStep.name}`
      );
    },
    selectStep(step) {
      this.setStep(step);
      this.navToCurrStep();
    },
    next() {
      this.setStep(this.nextStep);
      this.navToCurrStep();
    },
    prev() {
      this.setStep(this.prevStep);
      this.navToCurrStep();
    }
  }
};
</script>

<style lang="scss" scoped>

@import "@/assets/style/modules/colors";
@import "@/assets/style/modules/media";

.issue-row {
  min-height: unset;
}
ul.list {
  list-style: none;
  background-color: $color_background;
  padding:0px;

  li{
    border-bottom: 1px solid #E9E9E9;
    .case-step{
      padding: 20px 10px 16px 35px !important;
      display: flex;
      align-items: center;
        button{
          color: $color_primary;
          font-size: 12px;
          text-decoration: none;
          padding:0px;
          padding-left: 17px;
          &:focus {
              border: none;
              box-shadow: none;
              outline: none;
          }
          &:hover{
            cursor: pointer;
            font-weight: bold;
          }
      }
      &.active{
        button{
            font-weight: bold;
            color: $color_accent;
        }
      }
      &:disabled,
      &[disabled]{
        cursor: not-allowed!important;
          button{
              cursor: not-allowed;
              color: #9199B4!important;
          }
    }
    }
  }
}
.issue-content{
  padding: 50px 70px 24px;
   @media #{$md-screen} {
    padding: 8px 8px 20px 12px;
  }
  @media #{$sm-screen} {
    padding: 8px 8px 20px 12px;
  }
  .wrapper-content-issue{
    background: white;
    padding: 24px 25px;
  }
  color: $color_primary;
}
.btn-group-issue{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  svg{
    stroke-width: 1px;
    stroke: $color_accent;
  }
  button{
    padding: 3px 15px 7px;
    margin: 0 8px ;
  }
  span{
    color: $color_accent;
    font-size: 12px;
    font-weight: bold;
  }
  button:hover {
    span{
      color: $white;
    }
    svg{
      stroke: $white;
    }
  }
  button.disabled{
    border: 1px solid $color_border;
    span{
      color: $color_border;
    }
    svg{
      stroke: $color_border;
    }
  }
  button.disabled:hover{
    span{
      color: $color_border;
    }
    svg{
      stroke: $color_border;
    }
  }
}
.issue-heading{
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e9e9e9;
  display: flex;
  justify-content: space-between;
  h4{
    color: $color_primary;
    margin: 0;
    font-weight: 600;
    font-size: 20px;
  }
  .btn-leave{
    color: $color_primary;
    display: flex;
    align-items: center;
    svg{
      margin-right: 4px;
    }
    &:hover{
      text-decoration: none;
    }
  }
}

.issue-menu {
  background-color: white;
}
</style>

