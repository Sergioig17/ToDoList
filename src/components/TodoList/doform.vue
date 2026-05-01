<script setup>
import { ref } from 'vue';
var input=ref({
    nombre: "",
    prioridad: "1"
});
var fyle=ref(0);
const props = defineProps({
    usuario: Object,
    añadir: Function,
    adjuntarArchivo: Function
});
function reinicio(){
    input.value={
        nombre: "",
        prioridad: "1"
    }
}
</script>
<template>
    <form class="form-container" @submit.prevent="añadir(input);reinicio()">
        <input type="text" placeholder="Nueva tarea..." v-model="input.nombre" class="input-tarea"/>
        <div>Prioridad:</div>
        <select v-model="input.prioridad" class="select-prioridad"  >
            <option value="1">Baja</option>
            <option value="2">Media</option>
            <option value="3">Alta</option>
        </select>
        <input class="form-container__file" type="file" :key="input" @change="adjuntarArchivo" accept=".png, .jpg, .jpeg">
        <button type="submit" class="btn-add">Añadir</button>
    </form>
</template>

<style scoped>
.form-container {
    display: flex;
    gap: 12px;
    width: 100%;
    max-width: 760px;
    margin-bottom: 26px;
    flex-wrap: wrap;
}

.input-tarea {
    flex: 1;
    min-width: 240px;
    padding: 13px 14px;
    border: 1px solid #b7c8d9;
    border-radius: 10px;
    font-size: 1rem;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    background-color: #f4f8fc;
    color: #023f80;
}

.input-tarea::placeholder {
    color: #66809b;
}

.input-tarea:focus {
    outline: none;
    border-color: #4f759d;
    box-shadow: 0 0 0 4px rgba(79, 117, 157, 0.2);
}

.btn-add {
    background: linear-gradient(135deg, #365a80 0%, #4f759d 100%);
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    font-size: 1rem;
}

.btn-add:hover {
    background: linear-gradient(135deg, #2f4f71 0%, #44688d 100%);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(47, 79, 113, 0.28);
}

.btn-add:active {
    transform: translateY(0);
}
.form-container__file {
    font-size: 0.95rem;
    color: #20374f;
    background: #f4f8fc;
    border: 1px dashed #b7c8d9;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease;
}
.form-container__file:hover {
    border-color: #4f759d;
    background: #eef5fb;
}
.select-prioridad {
    padding: 13px 14px;
    border: 1px solid #b7c8d9;
    border-radius: 10px;
    font-size: 1rem;
    background-color: #f4f8fc;
    color: #20374f;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.select-prioridad:focus {
    outline: none;
    border-color: #4f759d;
    box-shadow: 0 0 0 4px rgba(79, 117, 157, 0.2);
}
@media (max-width: 768px) {
    .form-container {
        max-width: 100%;
        flex-direction: column;
    }

    .input-tarea {
        min-width: 100%;
    }

    .btn-add {
        width: 100%;
    }
}
</style>