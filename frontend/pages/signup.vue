<template>
  <b-container>
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
                    <input type="password" class="form-control" placeholder="Confirm password">
                </div>
                <div class="form-group">
                    <small class="form-text text-muted">Are you already User, Please <a href="#">login</a>!</small>
                </div>
                <button type="submit" class="btn btn-primary" @click="onSignUp">SignUp</button>
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
            phone: ""
        };
    },
    methods: {
        async onSignUp() {
            try {
                let data = {
                    name: this.name,
                    email: this.email,
                    phone: this.phone,
                    password: this.password
                }
                
                let response = await this.$axios.$post("api/signup", data);
                console.log(response);
                
                this.$router.push("/");

            } catch(err) {
                console.log(err);
            }
        }
    }
}
</script>

<style>
    .signup-form {
        padding: 50px 0px;
    }
</style>
