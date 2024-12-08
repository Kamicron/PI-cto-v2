<template>
    <header class='header'>
        <div class="container">
            <h1 class="header__title">
                <img class="header__title--logo"
                    src="http://api.pi-cto.top/uploads/16d20c54-45bf-4dba-bbc1-9e377f7c224e/1733610590735-Pi-cto_logo_orange.png"
                    alt="Logo de Pi-cto">
            </h1>
            <Login />

        </div>
    </header>
</template>

<script setup lang='ts'>
// ----- Import -----

// ------------------

// ------ Type ------

// ------------------

// ----- Define -----

// ------------------

// ------ Const -----

// ------------------

// ---- Reactive ----

// ------------------

// ---- Computed ----

// ------------------

// ------ Hooks -----

// ------------------

// --- Async Func ---

// ------------------

// ---- Function ----

// ------------------

// ------ Watch -----

// ------------------

</script>

<style lang='scss' scoped>
.header {
    background-color: $primary-color;

    .container {
        color: white;
        padding: 10px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1800px;
        margin: auto;
    }

    &__title--logo {
        height: 50px;
    }

}
</style>