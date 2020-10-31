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
                    <label>Name</label>
                    <input type="text" class="form-control" :placeholder="owner.name" v-model="name">
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input type="text" class="form-control" :placeholder="owner.email" v-model="email">
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="text" class="form-control" :placeholder="owner.phone" v-model="phone">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" class="form-control" placeholder="***********" v-model="password">
                </div>
                <div class="form-group">
                    <label>Confirm Password</label>
                    <input type="password" class="form-control" placeholder="Confirm password" v-model="confirmPassword">
                </div>
                <a class="btn btn-colour-1" @click="onUpdateProfile">Update Owner</a>
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
            let response = await $axios.$get("/api/owner");
            return {
                owner: response
            };
        } catch(err){
            console.log(err);
        }
    },    
    data() {
        return {
            name: "",
            email: "",
            password: "",
            phone: "",
            confirmPassword: "",
            message: ""
        };
    },
    methods: {
        async onUpdateProfile() {
            if(this.password === this.confirmPassword){
                try {
                    let data = {
                        name: this.name,
                        email: this.email,
                        phone: this.phone,
                        password: this.password
                    }
                    
                    let response = await this.$axios.$put("api/owner", data);
                    // console.log(response);
                    if(response.success){
                        this.message = response.message
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        this.$router.push("/");
                    }
                    return this.message = response.message
                } catch(err) {
                    console.log(err);
                }
            } else {
                return this.message = "Password & Confrim password should be same!"
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
