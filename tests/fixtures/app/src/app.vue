<script lang="ts" setup></script>

<template>
    <div class="app">
        <img src="./assets/images/reze.jpeg" alt="reze" />
        <pre class="poem">
            春花秋月何时了？往事知多少。小楼昨夜又东风，故国不堪回首月明中。
            雕栏玉砌应犹在，只是朱颜改。问君能有几多愁？恰似一江春水向东流。
        </pre>
    </div>
</template>

<style lang="css">
@font-face {
    font-family: chanYuHuYangTi;
    src: url('./assets/fonts/蝉羽胡杨体.ttf');
}

* {
    margin: 0;
    padding: 0;
}

body {
    width: 100vw;
    height: 100vh;
}

.poem {
    font-family: chanYuHuYangTi;
    margin-top: 20px;
}

.app {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
