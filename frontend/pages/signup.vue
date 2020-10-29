<template>
  <b-container>
    <div class="alert-message">
        <b-alert  v-if="this.message" show variant="danger"><a href="#" class="alert-link">{{message}}</a></b-alert>
    </div>
    <b-row>
        <b-col></b-col>
        <b-col>
            <form class="signup-form">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" class="form-control" placeholder="Enter name" v-model="name">
                </div>

                <div class="form-group">
                    <label>Email address</label>
                    <input type="email" class="form-control" placeholder="Enter email" v-model="email">
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="text" class="form-control" placeholder="Enter phone" v-model="phone">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" class="form-control" placeholder="Password" v-model="password">
                </div>
                <div class="form-group">
                    <label>Confirm Password</label>
                    <input type="password" class="form-control" placeholder="Confirm password" v-model="confirmPassword">
                </div>
                <div class="form-group">
                    <small class="form-text text-muted">Are you already User, Please <a href="#">login</a>!</small>
                </div>
                <a href="#" class="btn btn-colour-1" @click="onSignUp">Sign Up</a>
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
            email: "",
            password: "",
            phone: "",
            confirmPassword: "",
            message: ""
        };
    },
    methods: {
        async onSignUp() {
            if(this.password === this.confirmPassword){
                try {
                    let data = {
                        name: this.name,
                        email: this.email,
                        phone: this.phone,
                        password: this.password
                    }
                    
                    let response = await this.$axios.$post("api/signup", data);
                    console.log(response);
                    if(!response.error){
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
