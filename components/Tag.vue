<template>
    <div class="tag" :class="tagColorClass">
        <p>{{ label }}</p>
    </div>
</template>

<script>
export default {
    name: 'Tag',
    props: {
        label: {
            type: String,
            default: ''
        },
        color: {
            default: 'gray',
            type: String,
            validator: function (value) {
                return ['green', 'gray', 'purple', 'dark-purple', 'gold', 'red', 'dark-green'].includes(value);
            }
        }
    },
    computed: {
        tagColorClass() {
            return `tag--${this.color}`;
        }
    }
}

</script>
