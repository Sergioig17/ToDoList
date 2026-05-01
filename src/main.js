import { createApp } from "vue";
import "./Style.css";
import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "./components/LandingPage.vue";
import Recordatorios from "./components/Recordatorio.vue";
import { initializeApp } from "firebase/app";
import { VueFire } from "vuefire";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: Vite_ENV_FIREBASE_API_KEY,

  authDomain: "todolistvue-c7d48.firebaseapp.com",

  projectId: "todolistvue-c7d48",

  storageBucket: "todolistvue-c7d48.firebasestorage.app",

  messagingSenderId: "1082733761236",

  appId: "1:1082733761236:web:478cd7946a9745168fa141",
};

const firebaseApp = initializeApp(firebaseConfig);

import App from "./App.vue";

const routes = [
  { path: "/", component: LandingPage, meta: { requiresAuth: false } },
  {
    path: "/recordatorios",
    component: Recordatorios,
    meta: { requiresAuth: true },
  },
];
export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  var estasautenticado = localStorage.getItem("autenticado");

  if (to.meta.requiresAuth && !estasautenticado) {
    return false;
  } else return true;
});

const app = createApp(App);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebaseApp);

app.use(VueFire, {
  firebaseApp,
  modules: [],
});

app.use(router);

app.mount("#app");
