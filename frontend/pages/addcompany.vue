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
                    <input type="text" class="form-control" placeholder="Enter company name" v-model="name">
                </div>

                <div class="form-group">
                    <label>Company Type</label>
                    <b-form-select v-model="role" :options="options">
                        <template #first>
                            <b-form-select-option :value="null" disabled>-- Please select company type--</b-form-select-option>
                        </template>
                    </b-form-select> 
                </div>


                <div class="form-group">
                    <label>Pan Number</label>
                    <input type="text" class="form-control" placeholder="Enter pan number" v-model="panNumber">
                </div>
                <div class="form-group">
                    <label>Company Registration Number</label>
                    <input type="text" class="form-control" placeholder="Enter company registration number" v-model="registrationNumber">
                </div>
                <div class="form-group">
                    <label>DDA Number</label>
                    <input type="text" class="form-control" placeholder="Enter DDA NUmber" v-model="ddaNumber">
                </div>
                <a href="#" class="btn btn-colour-1" @click="onAddCompany">Add Company</a>
            </form>
        </b-col>
        <b-col></b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {   
    data() {
        return {
            name: "",
            panNumber: "",
            registrationNumber: "",
            ddaNumber: "",
            message: "",
            role: null,
            options: [
            { value: 0, text: 'Retailer' },
            { value: 1, text: 'Wholesaler' }
            ],
        };
    },
    methods: {
        async onAddCompany() {
            if(this.role == null){
                return this.message = "Please select company type";
            }
            try {
                let data = {
                    name: this.name,
                    panNumber: this.panNumber,
                    registrationNumber: this.registrationNumber,
                    ddaNumber: this.ddaNumber,
                    role: this.role
                }                
                let response = await this.$axios.$post("api/addCompany", data)
                .then(response => response.data)
                .catch(error => {
                    if (error.response) {
                    return this.message = error.response.data.message;
                    }
                });
                this.$router.push("/");
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
