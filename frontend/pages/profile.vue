<template>
  <b-container>
    <b-row>
        <b-col md="2"></b-col>
        <b-col md="8">
            <div class="company-main-content">
                <div class="content-heading">
                    <p><em>Company Details</em></p>
                </div>
                <div class="content-details">
                    <b-row>
                        <b-col md="6">
                            <p>
                                Name: <em style="padding-left: 116px">{{company.company_name}}</em><br>
                                Registration Number: &nbsp;&nbsp;<em>{{company.registration_no}}</em><br>
                                DDA Number: <em style="padding-left: 59px">{{company.dda_no}}</em><br>
                            </p>
                        </b-col>
                        <b-col md="6">
                            <p>
                                Type: 
                                <template v-if="role == 1 ">
                                    <em style="padding-left: 68px">Wholesaler</em> 
                                </template>
                                <template v-else>
                                    <em style="padding-left: 68px">Retailer</em> 
                                </template>
                                <br>PAN Number: &nbsp;&nbsp;<em>{{company.pan_number}}</em><br>
                            </p>
                        </b-col>
                    </b-row>
                </div>
            </div>
            <div class="profile-main-content">
                <div class="content-heading">
                    <p><em>Owner Details</em></p>
                </div>
                <div class="content-details">
                    <p>
                        Name: &nbsp;&nbsp;&nbsp;<em>{{owner.name}}</em><br>
                        Phone: &nbsp;&nbsp;<em>{{owner.phone}}</em><br>
                        Email: &nbsp;&nbsp;&nbsp;<em>{{owner.email}}</em><br>
                    </p>
                </div>
            </div>
            <br><br>
            <div class="float-right">
                <a class="btn btn-colour navbar-links"><nuxt-link to="/updateprofile">Update Owner</nuxt-link></a>
            </div>
        </b-col>
        <b-col md="2"></b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
    async asyncData({ $axios, $auth }) {
        try {
            let response =  $axios.$get(`/api/company/${$auth.$state.user.companyID}`);
            let owner =  $axios.$get("/api/owner");

            let[ companyResponse, ownerResponse ] = await Promise.all([
                response,
                owner
            ]);
            return {
                company: companyResponse, 
                owner: ownerResponse
            };
        } catch(err){
            console.log(err);
        }
    }
}
</script>

<style>
.company-main-content {
    padding: 50px 0px;
}

.content-heading {
    background-color: #006266;
    color: #FFF;
    border-radius: 2px;
}
.content-heading > p {
    padding: 5px 10px;
    font-size: 17px;
}
.content-details {
    padding: 0px 20px;
}

.btn-colour {
  color: #fff;
  background-color: #006266;
  border-color: #006266;
  font-weight: bold;
  letter-spacing: 0.05em;
  border-radius: 0;
}

.btn-colour:hover,
.btn-colour:active,
.btn-colour:focus,
.btn-colour.active {
  /* let's darken #004E64 a bit for hover effect */
  background: #006266;
  color: #ffffff;
  border-color:#006266;
}
</style>
