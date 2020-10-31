<template>
  <b-container>
    <div class="alert-message">
        <b-alert  v-if="this.message" show variant="danger"><a href="#" class="alert-link">{{message}}</a></b-alert>
    </div>
    <b-row>
        <b-col></b-col>
        <b-col>
            <form class="company-form">
                
                <div class="form-group">
                    <label>Company Name</label>
                    <input type="text" class="form-control" :placeholder="company.company_name" v-model="name">
                </div>

                <div class="form-group">
                    <label>Pan Number</label>
                    <input type="text" class="form-control" :placeholder="company.pan_number" v-model="panNumber">
                </div>
                <div class="form-group">
                    <label>Company Registration Number</label>
                    <input type="text" class="form-control" :placeholder="company.registration_no" v-model="registrationNumber">
                </div>
                <div class="form-group">
                    <label>DDA Number</label>
                    <input type="text" class="form-control" :placeholder="company.dda_no" v-model="ddaNumber">
                </div>
                <a href="#" class="btn btn-colour-1" @click="onUpdateCompany">Update Company</a>
            </form>
        </b-col>
        <b-col></b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
    async asyncData({ $axios, $auth }) {
        try {
            let response = await $axios.$get(`/api/company/${$auth.$state.user.companyID}`);
            return {
                company: response
            };
        } catch(err){
            console.log(err);
        }
    },    
    data() {
        return {
            name: "",
            panNumber: "",
            registrationNumber: "",
            ddaNumber: "",
            message: "",
        };
    },
    methods: {
        async onUpdateCompany() {
            try {
                let data = {
                    name: this.name,
                    panNumber: this.panNumber,
                    registrationNumber: this.registrationNumber,
                    ddaNumber: this.ddaNumber
                }                
                let response = await this.$axios.$put(`/api/company/${this.$auth.$state.user.companyID}`, data)
                .catch(error => {
                    if (error.response) {
                    return this.message = error.response.data.message;
                    }
                });
                this.message = response.message;
                await new Promise(resolve => setTimeout(resolve, 3000));
                if(response.success){
                    this.$router.push("/");
                }
            } catch(err) {
                console.log(err);
            }
        }
    }
}
</script>

<style>
.company-form {
    padding: 20px 0px;
}

.btn-colour-1 {
  color: #fff;
  background-color: #004E64;
  border-color: #004E64;
  font-weight: bold;
  letter-spacing: 0.05em;
  border-radius: 0;
}

.btn-colour-1:hover,
.btn-colour-1:active,
.btn-colour-1:focus,
.btn-colour-1.active {
  /* let's darken #004E64 a bit for hover effect */
  background: #003D4F;
  color: #ffffff;
  border-color: #003D4F;
}

.alert-message {
    padding: 15px 0px;
    text-align: center;
}
</style>
