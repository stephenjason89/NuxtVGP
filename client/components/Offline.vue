<template>
    <v-app class="offline">
        <v-row align="center" justify="center">
            <v-col cols="6">
                <v-row justify="center">
                    <p class="white--text text-h1 font-weight-black">{{ title }}</p>
                </v-row>
                <v-row justify="center">
                    <p class="white--text subtitle-1 font-weight-medium">
                        {{ message }}
                    </p>
                </v-row>
                <v-row justify="center">
                    <div class="spinner">
                        <div class="rect1" />
                        <div class="rect2" />
                        <div class="rect3" />
                        <div class="rect4" />
                        <div class="rect5" />
                    </div>
                </v-row>
                <slot />
            </v-col>
        </v-row>
    </v-app>
</template>

<script>
export default {
    name: 'Offline',
    props: {
        title: {
            type: String,
            default: 'Offline',
        },
        message: {
            type: String,
            default: 'Please check your internet connection',
        },
    },
}
</script>

<style scoped>
.offline {
    overflow: hidden;
    background-color: firebrick;
}

.spinner {
    width: 70px;
    height: 50px;
    text-align: center;
    font-size: 15px;
}

.spinner > div {
    background-color: #fff;
    height: 100%;
    width: 8px;
    display: inline-block;
    animation: sk-stretch-delay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
    animation-delay: -1.1s;
}

.spinner .rect3 {
    animation-delay: -1s;
}

.spinner .rect4 {
    animation-delay: -0.9s;
}

.spinner .rect5 {
    animation-delay: -0.8s;
}

@keyframes sk-stretch-delay {
    0%,
    40%,
    100% {
        transform: scaleY(0.4);
    }

    20% {
        transform: scaleY(1);
    }
}

@keyframes sk-stretch-delay {
    0%,
    40%,
    100% {
        transform: scaleY(0.4);
    }

    20% {
        transform: scaleY(1);
    }
}
</style>
