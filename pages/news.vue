<template>
  <div class="layout">
    <SiteHeader/>
    <div class="flex">
      <OfficeMenu/>
      <div class="content">
        <div class="t1-2">С нами уже много хороших людей:</div>
        <div class="user t1-5" v-for="user in users" :key="'user#'+user.id">
          <div class="name" @click="openCompanyCard(user['id'])">
            {{user['nickname']}} ({{user['username']}})
          </div>
        </div>
        <CompanyCard ref="companyCard"/>
      </div>
    </div>

  </div>
</template>

<script>
  import SiteHeader from "../components/shared/SiteHeader";
  import OfficeMenu from "../components/shared/OfficeMenu";
  import CompanyCard from "../components/company/CompanyCard";
  import axios from "axios";

  export default {
    name: "news",
    components: {SiteHeader, OfficeMenu, CompanyCard},
    data() { return {
      users: [{id: 1},{id: 2}]
    }},
    methods: {
      openCompanyCard(userId) {
        this.$refs.companyCard.getData(userId);
      }
    },
    mounted() {
      axios
        .get(this.$store.state.host + "/account/get-user-list")
        .then((response)=>{
          this.users = response.data;
        })
        .catch(()=>{console.warn('server error')});
    },
  }
</script>

<style scoped lang="sass">
  .layout
    width: 1140px
    margin: auto
    background: white
  .flex
    display: flex
  .name
    cursor: default
    &:hover
      text-decoration: underline
    &:active
      color: gray

</style>
