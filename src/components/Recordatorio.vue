<script setup>
import { addDoc, getFirestore, orderBy } from "firebase/firestore";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { collection, query, where, deleteDoc, doc ,updateDoc} from "firebase/firestore";
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";  
import { useCollection } from "vuefire";
import { supabase } from '../supabase';
import ToDo from "./TodoList/toDo.vue";
import doform from "./TodoList/doform.vue";

//VARIABLES
const router = useRouter();
const db=getFirestore();
var lista = [];
var user=localStorage.getItem("usuario");
var nombre=localStorage.getItem("nombre");
var admin=user=="XIa1E2k6N6OYvvJWY67OFlGRB5v1" ? true : false;
const auth = getAuth();
var verTodos=ref(false);
var q=ref("");
var cargado=ref(false);
const todasTareas = collection(db, "tareas");
var archivo;


//FUNCIONES
//Logeos
function logOut(){
    signOut(auth).then(()=>{
        localStorage.removeItem("usuario");
        localStorage.setItem("autenticado", "false");
        router.push('/');
    }).catch((error) => {
        console.log(error);
    });
}

onAuthStateChanged(auth, (usuario) => {

    if(!admin){
        q.value = query(todasTareas, where("uid", "==", user),orderBy("prioridad", "desc"));
    }else{
        q.value = query(todasTareas, orderBy("prioridad", "desc"));
    }
    lista = useCollection(q.value);
    cargado.value=true;
});
//TAREAS
function adjuntarArchivo(event){
    archivo=event.target.files[0];
}
async function añadirTarea(nuevatarea){
    var entrada={
        nombre: nuevatarea.nombre,
        realizado: false,
        uid: user,
        editado:false,
        prioridad: nuevatarea.prioridad,
        url: "vacio",
        nombreuser: nombre
    }
    var erorres=[];
    if(archivo){
        var nombreArchivo = nuevatarea.nombre+"_img";
        const {data,error } = await  supabase.storage.from('ToDoFotos').upload(nombreArchivo, archivo);
        
        if(error){
            erorres.push('Error al subir el archivo:'+ error);
        } else {
            const { data, error: urlError } = supabase.storage.from('ToDoFotos').getPublicUrl(nombreArchivo);
            if (!urlError) {
                entrada.url = data.publicUrl;
            } else {
                erorres.push('Error al obtener la URL pública del archivo:' + urlError);
            }
        }
        if(erorres.length > 0){
            console.error('Errores al adjuntar el archivo:', erorres);
        }
    }
    
  await addDoc(collection(db,"tareas"),entrada);
  

}

//ADMIN
async function vertodoschange(){
    verTodos.value=!verTodos.value;
    cargado.value=false;
    if(verTodos.value){
        q.value = query(todasTareas, where("uid", "==", user),orderBy("prioridad", "desc"));
    }
    else{
        q.value = query(todasTareas, orderBy("prioridad", "desc"));
    }
    lista = await useCollection(q.value);
    cargado.value=true;
}


//ACIONES SOBRE TAREAS
async function editartarea(tareaedit) {
    await updateDoc(doc(db, "tareas", tareaedit.id), {
        editado: !tareaedit.editado
    });
}
async function eliminartarea(tareaelim) {
    const docRef = doc(db, "tareas", tareaelim.id);
    if(tareaelim.url!="vacio"){
        var {data,error}=await supabase.storage.from('ToDoFotos').remove([tareaelim.nombre+"_img"]);
        if(error){
            console.error('Error al eliminar el archivo adjunto:', error);
        } else {
            console.log('Archivo adjunto eliminado correctamente');
        }
    }
    await deleteDoc(docRef);
}
function eliminarTodo(){
    for (let i = 0; i < lista.value.length; i++) {
        eliminartarea(lista.value[i]);
    }
}

async function confirmEdit(editarea,tareaedit){
    await updateDoc(doc(db, "tareas", tareaedit.id), {
            nombre: editarea.nombre,
            prioridad: editarea.prioridad,
            editado: false
        });
    
}
</script>
<template>
    <div class="recordatorio-wrapper">
        <div class="usuario-section">
            <h2 v-if="admin" class="admin-label">👑 Admin</h2>
            <h2 v-else class="user-label">Usuario</h2>
            <p class="usuario-nombre">{{ nombre }}</p>
            <button @click="logOut" class="btn-logout">Cerrar sesión</button>
        </div>
        <div class="recordatorio-main">
            <h1>Recordatorios</h1>
            <button @click="eliminarTodo" class="borradototal">Eliminar Todo</button>
            <button v-if="admin" @click="vertodoschange" class="btn-toggle" >{{ verTodos ? 'Mis tareas' : 'Todas' }}</button>
            <doform :añadir="añadirTarea" :adjuntarArchivo="adjuntarArchivo"></doform>
            <TransitionGroup tag="ul" name="animationlist" v-if="cargado" class="tareas-list">
                <toDo v-for="tarea in lista" :key="tarea.id"
                :tarea="tarea"
                :editar="editartarea"
                :eliminar="eliminartarea"
                :confirmEdit="confirmEdit"
                :admin="admin"
                :usuario="nombre"
                ></toDo>
            </TransitionGroup>
            
            <p v-else class="loading">Cargando...</p>
        </div>
    </div>
</template>

<style scoped>
.recordatorio-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    width: 50%;
    align-self: center;
    justify-self: center;
    background-color: var(--color-surface);
    flex: 1;
    padding: 1rem;
    position: relative;
}

.usuario-section {
    position: absolute;
    top: 24px;
    right: 24px;
    background: var(--color-surface);
    padding: 16px 20px;
    border-radius: 14px;
    border: 1px solid var(--color-surface-border);
    box-shadow: var(--shadow-card);
    text-align: right;
}

.admin-label {
    color: var(--color-text-primary);
    font-size: 1.08rem;
    margin: 0 0 6px;
    font-weight: 700;
}

.user-label {
    color: var(--color-text-primary);
    font-size: 1.08rem;
    margin: 0 0 6px;
    font-weight: 700;
}

.usuario-nombre {
    color: var(--color-text-secondary);
    font-size: 0.95rem;
    margin: 0 0 12px;
    font-weight: 600;
}

.btn-logout {
    background-color: var(--color-danger);
    color: var(--color-on-primary);
    padding: 9px 14px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    font-size: 0.9rem;
}

.btn-logout:hover {
    background-color: var(--color-danger-strong);
    transform: translateY(-2px);
    box-shadow: var(--shadow-danger);
}

.recordatorio-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 28px;
}

.recordatorio-main h1 {
    color: var(--color-text-title);
    font-size: clamp(2rem, 4.5vw, 2.8rem);
    margin: 0 0 24px;
    font-weight: 800;
    letter-spacing: 0.01em;
}

.tareas-list {
  position: relative;
  list-style: none; 
  padding: 0;
}

.animationlist-enter-active,
.animationlist-leave-active {
  transition: all 0.8s ease;
}

.animationlist-leave-active {
  position: absolute;
  width: 100%; 
}

.animationlist-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

.animationlist-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

.animationlist-move {
  transition: transform 0.7s ease;
}

.animationlist-leave-to {
  opacity: 0;
  transform: translateX(100px);
  transition: transform 0.7s ease, opacity 0.3s ease;
}

.btn-toggle {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    padding: 10px 22px;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 22px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    font-size: 1rem;
}

.btn-toggle:hover {
    background-color: var(--color-primary-strong);
    transform: translateY(-2px);
    box-shadow: var(--shadow-primary);
}

.tareas-list {
    list-style: none;
    padding: 0;
    width: 100%;
    max-width: 760px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.loading {
    color: var(--color-text-muted);
    font-size: 1.1rem;
    text-align: center;
    margin-top: 40px;
    font-weight: 600;
}
.borradototal {
    background-color: var(--color-danger);
    color: var(--color-on-primary);
    padding: 10px 22px;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 22px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    font-size: 1rem;
}
.borradototal:hover {
    background-color: var(--color-danger-strong);
    transform: translateY(-2px);
    box-shadow: var(--shadow-danger);
}
@media (max-width: 768px) {
    .recordatorio-wrapper {
        padding: 14px;
    }

    .usuario-section {
        position: static;
        width: 100%;
        margin-bottom: 22px;
        text-align: center;
    }

    .recordatorio-main h1 {
        font-size: 2rem;
    }

    .tareas-list {
        max-width: 100%;
    }
}

@media (max-width: 480px) {
    .recordatorio-wrapper {
        padding: 10px;
    }

    .usuario-section {
        padding: 14px;
    }

    .recordatorio-main h1 {
        font-size: 1.8rem;
        margin-bottom: 20px;
    }

    .btn-toggle {
        padding: 8px 16px;
        font-size: 0.9rem;
        width: 100%;
        max-width: 320px;
    }
}
</style>