<script setup>
import { vModelCheckbox } from 'vue';
import { ref } from 'vue';

const props = defineProps({
    tarea: Object,
    editar: Function,
    eliminar: Function,
    confirmEdit: Function,
    admin: Boolean,
    usuario: String
});
var editarea = ref({
    nombre: props.tarea.nombre,
    prioridad: props.tarea.prioridad
});
</script>

<template>
    <li v-if="!tarea.editado" class="tarea-item">
        <div v-if='tarea.url!="vacio"' class="imagen-tarea">
            <img :src="tarea.url" class="imagen-tarea__img" :class="{realizado: tarea.realizado}" alt="Imagen de la tarea" />
        </div>
        <div class="tarea" :class="{ realizado: tarea.realizado }">
            {{ tarea.nombre }}
        </div>
        <div v-if="admin">
            {{ tarea.nombreuser==usuario ? 'Tuya' : 'De ' + tarea.nombreuser }}
        </div>
        <div class="tarea-prioridad" :class="{
            'prioridad-alta': tarea.prioridad === '3',
            'prioridad-media': tarea.prioridad === '2',
            'prioridad-baja': tarea.prioridad === '1'
        }">
            {{ tarea.prioridad==='1' ? 'Baja' : tarea.prioridad==='2' ? 'Media' : 'Alta' }}
        </div>
        <div class="tarea-actions">
            <a v-if="tarea.url !== 'vacio'" :href="`${tarea.url}?download=`" download class="btn-icon btn-link">descargar</a>
            <input v-model="tarea.realizado" type="checkbox" class="tarea-checkbox"/>
            <button @click="editar(tarea)" class="btn btn-edit">Editar</button>
            <button @click="eliminar(tarea)" class="btn btn-delete">Eliminar</button>
        </div>
    </li>
    <li v-else class="tarea-item editing-mode">
        <input v-model="editarea.nombre" class="input-edit" placeholder="Editar tarea"/>
        <select v-model="editarea.prioridad" class="select-prioridad">
                <option value="1">Baja</option>
                <option value="2">Media</option>
                <option value="3">Alta</option>
        </select>
        <button @click="confirmEdit(editarea, tarea)" class="btn btn-save">Guardar</button>
    </li>
</template>

<style scoped>
li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(248, 251, 255, 0.95);
    padding: 16px 14px;
    border-radius: 12px;
    border: 1px solid #bfd0e1;
    box-shadow: 0 8px 18px rgba(39, 60, 85, 0.12);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    gap: 12px;
}

li:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(39, 60, 85, 0.18);
}

li:nth-child(even) {
    border-left: 4px solid #4f759d;
}

li:nth-child(odd) {
    border-left: 4px solid #7f95af;
}

.tarea {
    flex: 1;
    color: #1f344c;
    font-size: 1rem;
    font-weight: 600;
    word-break: break-word;
    padding: 0 8px;
}
.imagen-tarea{
    max-width: 80px;
    max-height: 80px;
    overflow:hidden;
    border-radius: 8px;
}
.imagen-tarea__img {
    max-width: 100%;
    max-height:100%;
}
.imagen-tarea__img.realizado{
    filter: grayscale(100%) blur(2px);
}
.tarea.realizado {
    text-decoration: line-through;
    color: #6e859e;
}

.tarea-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #4f759d;
    flex-shrink: 0;
}

input[type="text"] {
    flex: 1;
    padding: 11px 12px;
    border: 1px solid #88a3bf;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    color: #1f344c;
    background: #f4f8fc;
}

input[type="text"]:focus {
    outline: none;
    border-color: #4f759d;
    box-shadow: 0 0 0 4px rgba(79, 117, 157, 0.2);
}

button {
    padding: 8px 14px;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    font-size: 0.9rem;
    flex-shrink: 0;
}

.btn-edit,
.btn-save {
    background-color: #2e9a4e;
    color: white;
}

.btn-edit:hover,
.btn-save:hover {
    background-color: #258041;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(37, 128, 65, 0.28);
}

.btn-delete {
    background-color: #dc4a4a;
    color: white;
}

.btn-delete:hover {
    background-color: #c63c3c;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(198, 60, 60, 0.28);
}

.editing-mode {
    gap: 10px;
}

@media (max-width: 768px) {
    li {
        flex-wrap: wrap;
        gap: 8px;
    }

    .tarea {
        width: 100%;
        min-width: 100%;
    }

    .tarea-actions {
        width: 100%;
        justify-content: flex-end;
        flex-wrap: wrap;
    }

    button {
        flex: 1;
        min-width: calc(50% - 4px);
    }

    input[type="text"] {
        width: 100%;
    }
}

@media (max-width: 480px) {
    li {
        padding: 12px;
        flex-direction: column;
        align-items: stretch;
    }

    .tarea {
        width: 100%;
        padding: 0;
    }

    .tarea-actions {
        justify-content: stretch;
    }

    button {
        width: 100%;
        min-width: 100%;
    }

    input[type="checkbox"] {
        width: 18px;
        height: 18px;
    }
}
</style>
