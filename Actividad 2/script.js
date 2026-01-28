console.log("script.js conectado correctamente");

const input = document.getElementById("nueva-tarea");
const botonAgregar = document.getElementById("agregar-tarea");
const lista = document.getElementById("lista-tareas");
const mensaje = document.getElementById("mensaje");

class Tarea {
    constructor(nombre, completa = false) {
        this.id = Date.now();
        this.nombre = nombre;
        this.completa = completa;
    }

    toggleCompleta() {
        this.completa = !this.completa;
    }

    editar(nuevoNombre) {
        this.nombre = nuevoNombre;
    }

    eliminar() {
        return this.id;
    }
}

class GestorDeTareas {
    constructor() {
        this.tareas = [];
        this.cargar();
    }

    agregarTarea(nombre) {
        const tarea = new Tarea(nombre, false);
        this.tareas.push(tarea);
        this.guardar();
        return tarea;
    }

    obtenerTodas() {
        return this.tareas;
    }

    eliminarTarea(id) {
        this.tareas = this.tareas.filter((t) => t.id !== id);
        this.guardar();
    }

    editarTarea(id, nuevoNombre) {
        const tarea = this.tareas.find((t) => t.id === id);
        if (!tarea) return;
        tarea.editar(nuevoNombre);
        this.guardar();
    }

    toggleCompleta(id) {
        const tarea = this.tareas.find((t) => t.id === id);
        if (!tarea) return;
        tarea.toggleCompleta();
        this.guardar();
    }

    guardar() {
        const plano = this.tareas.map((t) => ({
            id: t.id,
            nombre: t.nombre,
            completa: t.completa,
        }));
        localStorage.setItem("tareas", JSON.stringify(plano));
    }

    cargar() {
        const data = localStorage.getItem("tareas");
        if (!data) return;

        const plano = JSON.parse(data);

        this.tareas = [];
        plano.forEach((x) => {
            const t = new Tarea(x.nombre, x.completa);
            t.id = x.id;
            this.tareas.push(t);
        });
    }
}

const gestor = new GestorDeTareas();
renderLista();

function renderLista() {
    lista.innerHTML = "";

    const tareas = gestor.obtenerTodas();

    tareas.forEach((t) => {
        const li = document.createElement("li");
        li.className = t.completa ? "item completa" : "item";
        li.dataset.id = t.id;
        
        const badge = t.completa ? "Completada" : "Pendiente";

        li.innerHTML = `
        <div class="titulo">
            <span class="badge">${badge}</span>
            <span class="texto">${escapeHtml(t.nombre)}</span>
        </div>

        <div class="acciones">
            <button class="btn-completar" type="button">
                ${t.completa ? "Desmarcar" : "Completar"}
            </button>
            <button class="btn-editar" type="button">Editar</button>
            <button class="btn-eliminar" type="button">Eliminar</button>
        </div>
    `;
    lista.appendChild(li);
    });
}
    function mostrarError(texto){
    mensaje.textContent = texto;
    mensaje.classList.remove("oculto");
    mensaje.classList.add("mensaje-error");
    }

    function limpiarMensaje() {
    mensaje.textContent = "";
    mensaje.classList.add("oculto");
    mensaje.classList.remove("mensaje-error");
    }

    botonAgregar.addEventListener("click", () => {
        const texto = input.value.trim();
        
        if (texto === "") {
        mostrarError("!No puedes agregar una tarea vacia.");
        return;
        }

        limpiarMensaje();
        gestor.agregarTarea(texto);
        input.value = "";
        renderLista();
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") botonAgregar.click();
        });

        lista.addEventListener("click", (e) => {
            const li = e.target.closest("li");
            if (!li) return;
            
            const id = Number(li.dataset.id);

            if (e.target.classList.contains("btn-eliminar")) {
            gestor.eliminarTarea(id);
            renderLista();
            }

            if (e.target.classList.contains("btn-completar")) {
            gestor.toggleCompleta(id);
            renderLista();
            }

            if (e.target.classList.contains("btn-editar")) {
            const tareaActual = gestor.obtenerTodas().find((t) => t.id === id);
            if (!tareaActual) return;

            const nuevo = prompt("Editar tarea:", tareaActual.nombre);
            if (nuevo == null) return;

            const limpio = nuevo.trim();
            if (limpio === "") {
            mostrarError("!El nombre editado no puede quedar vacio");
            return;
            }

            limpiarMensaje();
            gestor.editarTarea(id, limpio);
            renderLista();
            }
        });

        function escapeHtml(texto) {
        return texto
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
        }