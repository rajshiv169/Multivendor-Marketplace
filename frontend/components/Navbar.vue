<template>
    <div>
        <b-navbar toggleable="lg" type="dark">
            <b-container>
                
                <b-navbar-brand class="navbar-links"><nuxt-link to="/">MulltiVendor App</nuxt-link></b-navbar-brand>
                

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>

                    <!-- Right aligned nav items -->
                    <b-navbar-nav class="ml-auto navbar-links">
                        <template v-if="$auth.$state.loggedIn" >
                            <b-nav-item-dropdown right>
                            <!-- Using 'button-content' slot -->
                                <template #button-content>
                                    <em style="color: #FFF"><b-avatar size="25px"></b-avatar>&nbsp;&nbsp;{{$auth.$state.user.name}}</em>
                                </template >
                                <b-dropdown-item class="navbar-links-dropdown"><nuxt-link to="/profile">Profile</nuxt-link></b-dropdown-item>
                                <template v-if="$auth.$state.user.companyID"><b-dropdown-item class="navbar-links-dropdown"><nuxt-link to="/updatecompany">Update Company</nuxt-link></b-dropdown-item></template>
                                <template v-else><b-dropdown-item class="navbar-links-dropdown"><nuxt-link to="/addcompany">Add Company</nuxt-link></b-dropdown-item></template>
                                <b-dropdown-item class="navbar-links-dropdown" @click="onLogout">Sign Out</b-dropdown-item>
                            </b-nav-item-dropdown>
                        </template>
                        <template v-else>
                            <nuxt-link to="/signup">
                                <span>Hello, Sign in</span>
                            </nuxt-link>
                        </template>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
    </div>
</template>

<script>
export default {
    methods : {
        async onLogout() {
            try {
                await this.$auth.logout();
            } catch(err){
                console.log(err);
            }
        }
    }
}
</script>

<style>

</style>
