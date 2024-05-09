<template>
    <v-row wrap no-gutters>
        <v-col class="text-center">
            <v-divider class="mt-3"/>
        </v-col>
        <v-col cols="4" class="text-center">
            {{ text }}
        </v-col>
        <v-col class="text-center">
            <v-divider class="mt-3"/>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
const props = defineProps({
    text: {
        type: String,
        required: true
    }
});
</script>
