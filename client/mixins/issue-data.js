

import form from '@/mixins/form.js';
import {required} from 'vuelidate/lib/validators';
import {mapActions} from 'vuex';

export default {
  mixins: [form],
  props: {
    title: {type: String, default: ''},
    description: {type: String, default: ''},
    disabled: {type: Boolean, default: false},
    validations: {type: Object, default: () => ({})},

    typeId: {type: Number, required: true},
    issueId: {type: Number, required: true},
    issueDataId: {type: Number, default: null},

    bind: {type: Boolean, default: true}
  },
  data() {
    return {
      form: {
        value: '',
        type: this.typeId
      }
    };
  },
  validations() {
    return {
      form: {
        value: this.validations,
        type: {required}
      }
    };
  },
  computed: {
    issueData() {
      if (!this.bind) return null;
      return this.$store.state.issue.issueData.find(issueData => {
        const typeMatch = issueData.type.id === this.typeId;
        if (this.issueDataId) {
          return typeMatch && issueData.id === this.issueDataId;
        }
        return typeMatch;
      });
    }
  },
  mounted() {
    if (this.issueData) {
      this.form.value = this.issueData.value;
    }
  },
  methods: {
    ...mapActions({
      getIssueData: 'issue/getIssueDataByType',

      update: 'issue/updateIssueData',
      create: 'issue/createIssueData'
    }),
    async submit(optValue) {
      if (this.anyError()) return;
      const value = optValue || this.form.value;
      try {
        if (this.issueData) {
          await this.update({
            id: this.issueId,
            issueDataId: this.issueData.id,
            data: {value}
          });
        } else {
          await this.create({
            id: this.issueId,
            data: {
              value,
              type: this.form.type
            }
          });
          if (!this.bind) {
            this.form.value = '';
            this.$v.$reset();
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
};
