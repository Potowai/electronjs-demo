<template>
    <div id="app">
        <!--  Navigation-->
        <ul uk-tab class="uk-margin">
            <li class="uk-active">
                <router-link to="/">Page One</router-link>
            </li>
            <li>
                <router-link to="/festivals">Festivals</router-link>
            </li>
        </ul>
        
        <div class="uk-container uk-container-medium">
            <router-view />
        </div>
    </div>
</template>

<script>
import UIkit from 'uikit';

export default {
    name: 'App',
    mounted() {
        UIkit.update();
    }
}
</script>

<style scoped>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    margin-top: 60px;
}
</style>