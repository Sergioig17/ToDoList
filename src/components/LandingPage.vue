<script setup>
import { getRedirectResult,OAuthProvider ,sendEmailVerification, browserLocalPersistence, setPersistence, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const emit = defineEmits(['logeado', 'usuario']);

var entrada = ref({
    email: '',
    password: '',
    confirmar: '',
    errores:[]
});
var usuario=ref({});
const auth = getAuth();

const googleprovider= new GoogleAuthProvider();
const githubprovider= new OAuthProvider('github.com');

async function loginauth(providername){
    var provider;
    switch (providername) {
        case 'google':
            provider=googleprovider;
            break;
        case 'github':
            provider=githubprovider;
        break;
    }
    await signInWithPopup(auth, provider)
    .then((result) => {
        usuario.value=result.user;
        localStorage.setItem('usuario', usuario.value.uid);
        localStorage.setItem('autenticado', 'true');
        sendEmailVerification(usuario.value);
        router.push('/recordatorios');
    })
    .catch((error) => {
        entrada.value.errores.push({
            codigo: error.code,
            message: error.message
        });
    })
}
async function loginem(datos){
    entrada.value.errores = [];

    if(datos.password!==datos.confirmar){
        entrada.value.errores.push({codigo: "PASS_MISMATCH", message: "Las contraseñas no coinciden"});
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, datos.email, datos.password);
        usuario.value = userCredential.user;
        localStorage.setItem('usuario', JSON.stringify(usuario.value.uid));
        localStorage.setItem('autenticado', 'true');
        router.push('/recordatorios');
    } catch (errorcreate) {
        if(errorcreate.code == "auth/email-already-in-use" || errorcreate.code=="EMAIL_EXISTS"){
            try {
                const signInCredential = await signInWithEmailAndPassword(auth, datos.email, datos.password);
                usuario.value = signInCredential.user;
                localStorage.setItem('usuario', JSON.stringify(usuario.value.uid));
                localStorage.setItem('autenticado', 'true');
                router.push('/recordatorios');
            } catch (errorsign) {
                entrada.value.errores.push({
                    codigo: errorsign.code,
                    message: errorsign.message
                });
            }
        } else {
            entrada.value.errores.push({
                codigo: errorcreate.code,
                message: errorcreate.message
            });
        }
    }
}
</script>

<template>
  <section class="landing-wrapper">
    <div class="landing-card">
      <h1>Comienza a ordenar tus tareas</h1>
      <h2>Regístrate o inicia sesión para comenzar</h2>
      <h3 v-if="entrada.errores.length > 0">
        <ul>
          <li v-for="error in entrada.errores" :key="error.codigo">
            {{ error.message }}
          </li>
        </ul>
      </h3>
      <input v-model="entrada.email" type="email" placeholder="Correo electrónico"/>
      <input v-model="entrada.password" type="password" placeholder="Contraseña"/>
      <input v-model="entrada.confirmar" type="password" placeholder="Confirmar contraseña"  v-on:keyup.enter="loginem(entrada)"/>
      <button @click="loginem(entrada)">Iniciar sesión</button>
      <button @click="loginauth('google')">Iniciar sesión con Google</button>
      <button @click="loginauth('github')">Iniciar sesión con GitHub</button>
    </div>
  </section>
</template>

<style scoped>
.landing-wrapper {
  min-height: 100%;
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}

.landing-card {
  width: min(100%, 620px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 32px 28px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: 0 18px 40px rgba(45, 67, 92, 0.22);
  backdrop-filter: blur(4px);
}

h1 {
  color: #1e3147;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  margin: 0;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-wrap: balance;
}

h2 {
  color: #455d78;
  font-size: 1rem;
  margin: 0 0 8px;
  font-weight: 500;
}

h3 {
  margin: 0;
  background: #ffe7e7;
  border: 1px solid #e46b6b;
  border-radius: 10px;
  padding: 12px 14px;
  color: #b73a3a;
}

h3 ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

h3 li {
  font-size: 0.92rem;
  line-height: 1.35;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 13px 14px;
  border: 1px solid #c5d1df;
  border-radius: 10px;
  font-size: 0.97rem;
  background: #f6f9fc;
  color: #1f3248;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

input[type="email"]:focus,
input[type="password"]:focus {
  outline: none;
  border-color: #5a85b8;
  box-shadow: 0 0 0 4px rgba(90, 133, 184, 0.18);
}

button {
  width: 100%;
  padding: 12px 14px;
  border: none;
  border-radius: 10px;
  font-size: 0.96rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

button:first-of-type {
  color: #ffffff;
  background: linear-gradient(135deg, #234a73 0%, #4d76a3 100%);
}

button:nth-of-type(2),
button:nth-of-type(3) {
  color: #1d3654;
  background: #dbe6f3;
}

button:hover {
  transform: translateY(-1px);
  filter: brightness(1.02);
  box-shadow: 0 8px 20px rgba(27, 49, 77, 0.18);
}

button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .landing-wrapper {
    align-items: flex-start;
    padding: 16px;
  }

  .landing-card {
    margin-top: 20px;
    padding: 22px 16px;
    border-radius: 14px;
  }
}
</style>