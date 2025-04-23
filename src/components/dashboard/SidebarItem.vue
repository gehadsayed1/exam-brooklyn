<template>
  <li>
    <div
      class="w-full p-3 cursor-pointer flex items-center justify-between hover:bg-gray-100 transition-all duration-300"
      :class="{ 'bg-indigo-100 text-indigo-600 font-semibold': isActive }"
      @click="toggle"
    >
      <div class="flex items-center gap-2">
        <component
          :is="item.icon"
          class="w-5 h-5"
          :class="{ 'text-indigo-600': isActive }"
          v-if="item.icon"
        />
        <span class="text-sm">{{ item.name }}</span>
      </div>

      <svg
        v-if="item.children"
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 transition-transform duration-200"
        :class="{ 'rotate-90': open }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>

    <transition name="fade-slide hover:bg-gray-100">
      <ul v-if="open && item.children" class="pl-10">
        <li
          v-for="child in item.children"
          :key="child.name"
          class="p-2 relative cursor-pointer font-semibold text-gray-600"
          :class="{
            activ: route.name === child.route,
          }"
          @click="router.push({ name: child.route })"
        >
          {{ child.name }}
          <span class="list-item absolute top-4 -left-3"></span>
        </li>
      </ul>
    </transition>
  </li>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const props = defineProps({ item: Object });
const router = useRouter();
const route = useRoute();

const open = ref(false);

// ✅ يفتح تلقائيًا لو فيه ولد active
onMounted(() => {
  if (props.item.children) {
    open.value = props.item.children.some(
      (child) => route.name === child.route
    );
  }
});

// ✅ يحدد العنصر الـ active
const isActive = computed(() => {
  if (props.item.route) {
    return route.name === props.item.route;
  }
  if (props.item.children) {
    return props.item.children.some((child) => route.name === child.route);
  }
  return false;
});


const toggle = () => {
  if (props.item.children) {
    open.value = !open.value;
  } else if (props.item.route) {
    router.push({ name: props.item.route });
  }
};
</script>

<style scoped>
li .list-item {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 10px;
  border-radius: 50%;
  background-color: #ccc;
  transition: background-color 0.3s, box-shadow 0.3s;
}

li.activ .list-item {
  background-color: #624ff6;
  box-shadow: 0 0 10px #624ff6;
}

ul {
  list-style-type: none;
}
</style>
