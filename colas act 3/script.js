/**
 * ============================================================================
 * EJERCICIO 3: ESTACIONAMIENTO PARA AUTOS (SIMULACIÓN DE CALLEJÓN / COLA)
 * Estructuras de Datos - JavaScript Puro (OOP)
 * ============================================================================
 */

/**
 * Clase Nodo que representa un Auto (Vehículo) en el estacionamiento.
 */
class CarNode {
    constructor(placas, propietario) {
        this.placas = placas.trim().toUpperCase();
        this.propietario = propietario.trim();
        this.horaEntrada = new Date(); // Objeto Date estricto al registrar la entrada
        this.siguiente = null;         // Puntero para la estructura ligada
    }
}

/**
 * Clase que simula una Cola Dinámica / Circular (Queue) para el callejón del estacionamiento.
 * Principio FIFO (First In, First Out).
 */
class AlleyQueue {
    constructor() {
        this.frente = null; // Primer auto en la fila (el que saldrá primero)
        this.final = null;  // Último auto en ingresar
        this.tamanio = 0;   // Conteo de vehículos
    }

    /**
     * Verifica si el estacionamiento está vacío.
     */
    isEmpty() {
        return this.tamanio === 0 || this.frente === null;
    }

    /**
     * Inserta un nuevo vehículo al final de la cola (Llegada al callejón).
     */
    enqueue(placas, propietario) {
        const nuevoAuto = new CarNode(placas, propietario);

        if (this.isEmpty()) {
            this.frente = nuevoAuto;
            this.final = nuevoAuto;
        } else {
            this.final.siguiente = nuevoAuto;
            this.final = nuevoAuto;
        }

        this.tamanio++;
        return nuevoAuto;
    }

    /**
     * Remueve y retorna el vehículo del frente de la cola (Salida del callejón).
     */
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }

        const autoSaliente = this.frente;
        this.frente = this.frente.siguiente;

        this.tamanio--;

        // Si la cola queda vacía, aseguramos que 'final' también sea null
        if (this.tamanio === 0) {
            this.final = null;
        }

        return autoSaliente;
    }

    /**
     * Retorna el auto al frente sin removerlo.
     */
    peek() {
        return this.frente;
    }

    /**
     * Retorna un arreglo con todos los elementos actuales para renderizado en la UI.
     */
    getItems() {
        const elementos = [];
        let actual = this.frente;
        while (actual !== null) {
            elementos.push(actual);
            actual = actual.siguiente;
        }
        return elementos;
    }

    /**
     * Retorna el número total de vehículos en el callejón.
     */
    size() {
        return this.tamanio;
    }
}

// ============================================================================
// GESTIÓN DE LA INTERFAZ Y CONTROLADOR DE LA APLICACIÓN
// ============================================================================

// Instanciamos la cola del estacionamiento
const estacionamiento = new AlleyQueue();

// Referencias a elementos del DOM
const parkingForm = document.getElementById('parkingForm');
const inputPlacas = document.getElementById('placas');
const inputPropietario = document.getElementById('propietario');
const btnSalida = document.getElementById('btnSalida');
const alleyContainer = document.getElementById('alleyContainer');
const statCount = document.getElementById('statCount');
const alertContainer = document.getElementById('alertContainer');

// Referencias al Modal de Comprobante
const receiptModal = document.getElementById('receiptModal');
const receiptBody = document.getElementById('receiptBody');
const closeModal = document.getElementById('closeModal');
const btnPrintReceipt = document.getElementById('btnPrintReceipt');

/**
 * Formatea un objeto Date a hora legible (HH:MM:SS).
 */
function formatearHora(fecha) {
    return fecha.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}

/**
 * Muestra notificaciones temporales en pantalla.
 */
function mostrarAlerta(mensaje, tipo = 'success') {
    alertContainer.innerHTML = `
        <div class="alert alert-${tipo}">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${tipo === 'success' 
                    ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>' 
                    : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>'}
            </svg>
            <span>${mensaje}</span>
        </div>
    `;
    alertContainer.classList.remove('hidden');

    // Ocultar automáticamente después de 4 segundos
    setTimeout(() => {
        alertContainer.classList.add('hidden');
    }, 4000);
}

/**
 * Actualiza la representación gráfica del callejón en la interfaz.
 */
function actualizarVistaAlley() {
    const autos = estacionamiento.getItems();
    statCount.textContent = estacionamiento.size();

    if (autos.length === 0) {
        alleyContainer.innerHTML = `
            <div class="empty-alley">
                <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                <p>El callejón está actualmente vacío.</p>
                <span>Los vehículos ingresados aparecerán aquí.</span>
            </div>
        `;
        return;
    }

    let html = '';
    autos.forEach((auto, index) => {
        const esFrente = index === 0;
        html += `
            <div class="car-card ${esFrente ? 'front-car' : ''}">
                <div class="car-info">
                    <div class="car-main-details">
                        <span class="car-plate">${auto.placas}</span>
                        <span class="car-owner">${auto.propietario}</span>
                    </div>
                    <span class="car-time">Entrada: ${formatearHora(auto.horaEntrada)}</span>
                </div>
                <div>
                    <span class="car-badge ${esFrente ? 'badge-front' : 'badge-queue'}">
                        ${esFrente ? '🚗 Frente (Próximo en Salir)' : `Posición #${index + 1}`}
                    </span>
                </div>
            </div>
        `;
    });

    alleyContainer.innerHTML = html;
}

// ============================================================================
// EVENT LISTENERS Y LÓGICA DE NEGOCIO
// ============================================================================

// Evento: Registrar Entrada de Auto
parkingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const placas = inputPlacas.value.trim();
    const propietario = inputPropietario.value.trim();

    // Validación estricta de campos vacíos
    if (!placas || !propietario) {
        mostrarAlerta('Por favor, complete todos los campos obligatorios.', 'error');
        return;
    }

    // Insertar en la cola (registra automáticamente new Date() en el nodo)
    const nuevoAuto = estacionamiento.enqueue(placas, propietario);

    // Actualizar UI
    actualizarVistaAlley();
    mostrarAlerta(`Auto con placas [${nuevoAuto.placas}] registrado exitosamente.`);

    // Limpiar formulario
    parkingForm.reset();
    inputPlacas.focus();
});

// Evento: Procesar Salida de Auto
btnSalida.addEventListener('click', () => {
    // REGLA DE NEGOCIO: Validar obligatoriamente que el estacionamiento NO esté vacío
    if (estacionamiento.isEmpty()) {
        mostrarAlerta('Control de Acceso: El estacionamiento está vacío. No hay autos para procesar su salida.', 'error');
        return;
    }

    // Capturar hora exacta de salida
    const horaSalida = new Date();

    // Remover el auto del frente de la cola (FIFO)
    const autoSaliente = estacionamiento.dequeue();

    // Cálculo del tiempo transcurrido y costo
    // Tarifa: $2.00 pesos por cada segundo transcurrido
    const TARIFA_POR_SEGUNDO = 2.00;
    const diferenciaMs = horaSalida - autoSaliente.horaEntrada;
    
    // Calculamos segundos (mínimo 1 segundo para demostraciones rápidas)
    const segundosTranscurridos = Math.max(1, Math.round(diferenciaMs / 1000));
    const costoTotal = segundosTranscurridos * TARIFA_POR_SEGUNDO;

    // Poblar el modal de recibo
    receiptBody.innerHTML = `
        <div class="receipt-row">
            <span>Placas del Vehículo:</span>
            <span>${autoSaliente.placas}</span>
        </div>
        <div class="receipt-row">
            <span>Propietario:</span>
            <span>${autoSaliente.propietario}</span>
        </div>
        <div class="receipt-row">
            <span>Hora de Entrada:</span>
            <span>${formatearHora(autoSaliente.horaEntrada)}</span>
        </div>
        <div class="receipt-row">
            <span>Hora de Salida:</span>
            <span>${formatearHora(horaSalida)}</span>
        </div>
        <div class="receipt-row">
            <span>Tiempo Estacionado:</span>
            <span>${segundosTranscurridos} segundo(s)</span>
        </div>
        <div class="receipt-total">
            <span>Total a Pagar ($2.00 / seg):</span>
            <span class="total-amount">$${costoTotal.toFixed(2)} MXN</span>
        </div>
    `;

    // Mostrar modal de salida
    receiptModal.classList.remove('hidden');

    // Actualizar vista del callejón
    actualizarVistaAlley();
});

// Cerrar Modal de Comprobante
function cerrarModal() {
    receiptModal.classList.add('hidden');
}

closeModal.addEventListener('click', cerrarModal);
btnPrintReceipt.addEventListener('click', cerrarModal);

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === receiptModal) {
        cerrarModal();
    }
});

// Inicializar vista al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarVistaAlley();
    inputPlacas.focus();
});
