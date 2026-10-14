/**
 * ============================================================================
 * EJERCICIO 1. VENTANILLA DE UN BANCO - GESTIÓN DE COLA (FIFO)
 * ============================================================================
 * Desarrollado con JavaScript puro (ES6+), Clases y Programación Orientada a Objetos.
 */

class BancoCola {
    constructor(limiteMaximo = 10) {
        this.elementos = [];
        this.limiteMaximo = limiteMaximo;
        this.contadorTurnos = 1;
    }

    /**
     * Retorna true si la cola ha alcanzado el límite máximo, false en caso contrario.
     */
    colaLlena() {
        return this.elementos.length >= this.limiteMaximo;
    }

    /**
     * Retorna true si la cola no tiene elementos, false si contiene clientes.
     */
    colaVacia() {
        return this.elementos.length === 0;
    }

    /**
     * Retorna el número de elementos actuales en la cola.
     */
    obtenerTamanio() {
        return this.elementos.length;
    }

    /**
     * Obtiene el elemento al frente (Front) de la cola sin eliminarlo.
     */
    verFrente() {
        if (this.colaVacia()) return null;
        return this.elementos[0];
    }

    /**
     * Obtiene el elemento al final (Rear) de la cola sin eliminarlo.
     */
    verFinal() {
        if (this.colaVacia()) return null;
        return this.elementos[this.elementos.length - 1];
    }

    /**
     * Inserta un nuevo cliente al final de la cola (Enqueue).
     * Valida que no esté llena y que los datos sean correctos.
     */
    insertaCola(nombreCliente, tipoMovimiento) {
        if (this.colaLlena()) {
            throw new Error(`¡Cola Llena! Se ha alcanzado el límite máximo de ${this.limiteMaximo} turnos en espera.`);
        }

        if (!nombreCliente || !nombreCliente.trim()) {
            throw new Error('El nombre del cliente no puede estar vacío.');
        }

        if (!tipoMovimiento) {
            throw new Error('Debe seleccionar un tipo de movimiento válido.');
        }

        const nuevoCliente = {
            numeroTurno: this.contadorTurnos++,
            nombreCliente: nombreCliente.trim(),
            tipoMovimiento: tipoMovimiento,
            horaLlegada: new Date()
        };

        this.elementos.push(nuevoCliente);
        return nuevoCliente;
    }

    /**
     * Elimina el primer elemento de la cola (Dequeue / FIFO) para ser atendido en ventanilla.
     * Calcula el tiempo de espera en la cola.
     */
    eliminaCola() {
        if (this.colaVacia()) {
            throw new Error('¡Cola Vacía! No hay clientes en espera para atender en ventanilla.');
        }

        const clienteAtendido = this.elementos.shift();
        const horaAtencion = new Date();
        
        // Calcular tiempo de espera en segundos y minutos
        const diferenciaMs = horaAtencion - clienteAtendido.horaLlegada;
        const segundosEspera = Math.floor(diferenciaMs / 1000);
        const minutosEspera = Math.floor(segundosEspera / 60);
        const segundosRestantes = segundosEspera % 60;

        return {
            cliente: clienteAtendido,
            horaAtencion: horaAtencion,
            tiempoEsperaTexto: minutosEspera > 0 
                ? `${minutosEspera} min ${segundosRestantes} seg` 
                : `${segundosRestantes} segundos`,
            segundosEspera: segundosEspera
        };
    }

    /**
     * Reinicia completamente la cola y el contador de turnos.
     */
    reiniciar() {
        this.elementos = [];
        this.contadorTurnos = 1;
    }
}

// ============================================================================
// CONTROLADOR DE INTERFAZ (UI) Y EVENTOS
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Instanciar la cola con un límite de 10 turnos
    const banco = new BancoCola(10);

    // Referencias a elementos del DOM
    const timeDisplay = document.getElementById('current-time');
    const ticketForm = document.getElementById('ticket-form');
    const clientNameInput = document.getElementById('client-name');
    const movementTypeSelect = document.getElementById('movement-type');
    const queueTbody = document.getElementById('queue-tbody');
    const alertContainer = document.getElementById('alert-container');
    
    // Badges de Punteros y Estado
    const badgeFront = document.getElementById('badge-front');
    const badgeRear = document.getElementById('badge-rear');
    const badgeCount = document.getElementById('badge-count');
    const badgeStatus = document.getElementById('badge-status');

    // Botones de Acción
    const btnServe = document.getElementById('btn-serve');
    const btnReset = document.getElementById('btn-reset');
    const servedClientInfo = document.getElementById('served-client-info');

    // Modal de Atención
    const attentionModalEl = document.getElementById('attentionModal');
    const attentionModal = new bootstrap.Modal(attentionModalEl);
    const attentionModalBody = document.getElementById('attention-modal-body');

    // Actualizar reloj en tiempo real
    setInterval(() => {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString();
    }, 1000);

    // Función para mostrar alertas personalizadas (Bootstrap alerts)
    function mostrarAlerta(mensaje, tipo = 'danger') {
        alertContainer.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">
                <i class="fa-solid ${tipo === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'} me-2"></i>
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        // Auto ocultar después de 5 segundos
        setTimeout(() => {
            const alertEl = alertContainer.querySelector('.alert');
            if (alertEl) {
                const bsAlert = bootstrap.Alert.getOrCreateInstance(alertEl);
                bsAlert.close();
            }
        }, 5000);
    }

    // Función principal para actualizar la Interfaz Gráfica (UI)
    function actualizarUI() {
        // 1. Actualizar tabla de cola
        if (banco.colaVacia()) {
            queueTbody.innerHTML = `
                <tr id="empty-row">
                    <td colspan="5" class="text-center py-5 text-muted">
                        <i class="fa-solid fa-clipboard-list fa-3x mb-3 text-black-50"></i>
                        <p class="mb-0">La cola de espera está vacía actualmente.</p>
                    </td>
                </tr>
            `;
        } else {
            queueTbody.innerHTML = '';
            banco.elementos.forEach((cliente, index) => {
                const horaFormateada = cliente.horaLlegada.toLocaleTimeString();
                const esFrente = index === 0;
                const esFinal = index === banco.elementos.length - 1;

                let badgesPosicion = '';
                if (esFrente) badgesPosicion += '<span class="badge bg-success me-1">Front</span>';
                if (esFinal) badgesPosicion += '<span class="badge bg-danger">Rear</span>';
                if (!badgesPosicion) badgesPosicion = `<span class="text-muted small">Pos #${index + 1}</span>`;

                const tr = document.createElement('tr');
                if (index === banco.elementos.length - 1) {
                    tr.classList.add('queue-row-new');
                }

                tr.innerHTML = `
                    <td class="ps-3 fw-bold text-primary">#${cliente.numeroTurno}</td>
                    <td>${escapeHtml(cliente.nombreCliente)}</td>
                    <td><span class="badge bg-light text-dark border">${escapeHtml(cliente.tipoMovimiento)}</span></td>
                    <td><i class="fa-regular fa-clock text-muted me-1"></i>${horaFormateada}</td>
                    <td class="text-center">${badgesPosicion}</td>
                `;
                queueTbody.appendChild(tr);
            });
        }

        // 2. Actualizar Indicadores (Frente, Final, Conteo y Estado)
        const frente = banco.verFrente();
        const final = banco.verFinal();

        if (frente) {
            badgeFront.textContent = `Turno #${frente.numeroTurno} (${frente.nombreCliente})`;
            badgeFront.className = 'badge bg-success fs-6';
        } else {
            badgeFront.textContent = 'Ninguno';
            badgeFront.className = 'badge bg-secondary fs-6';
        }

        if (final) {
            badgeRear.textContent = `Turno #${final.numeroTurno} (${final.nombreCliente})`;
            badgeRear.className = 'badge bg-danger fs-6';
        } else {
            badgeRear.textContent = 'Ninguno';
            badgeRear.className = 'badge bg-secondary fs-6';
        }

        const tamanio = banco.obtenerTamanio();
        badgeCount.textContent = `${tamanio} / ${banco.limiteMaximo}`;

        if (banco.colaLlena()) {
            badgeStatus.textContent = 'COLA LLENA';
            badgeStatus.className = 'badge bg-danger fs-6';
        } else if (banco.colaVacia()) {
            badgeStatus.textContent = 'Vacía';
            badgeStatus.className = 'badge bg-secondary fs-6';
        } else {
            badgeStatus.textContent = 'Disponible';
            badgeStatus.className = 'badge bg-success fs-6';
        }
    }

    // Utilidad para prevenir XSS en inputs de usuario
    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;")
                  .replace(/'/g, "&#039;");
    }

    // Evento: Agregar a la Cola (insertaCola)
    ticketForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = clientNameInput.value;
        const movimiento = movementTypeSelect.value;

        try {
            // Validar si la cola está llena antes de insertar
            if (banco.colaLlena()) {
                throw new Error(`No se puede agregar. La cola ha alcanzado su límite máximo (${banco.limiteMaximo} clientes).`);
            }

            const clienteCreado = banco.insertaCola(nombre, movimiento);
            
            // Mensaje de confirmación detallado
            const horaStr = clienteCreado.horaLlegada.toLocaleTimeString();
            mostrarAlerta(
                `<strong>¡Turno agregado con éxito!</strong><br>` +
                `• Turno: <strong>#${clienteCreado.numeroTurno}</strong><br>` +
                `• Cliente: <strong>${escapeHtml(clienteCreado.nombreCliente)}</strong><br>` +
                `• Movimiento: <strong>${escapeHtml(clienteCreado.tipoMovimiento)}</strong><br>` +
                `• Hora de llegada: <strong>${horaStr}</strong>`,
                'success'
            );

            // Limpiar formulario y errores
            clientNameInput.value = '';
            movementTypeSelect.selectedIndex = 0;
            ticketForm.classList.remove('was-validated');

            // Actualizar UI
            actualizarUI();

        } catch (error) {
            mostrarAlerta(error.message, 'danger');
        }
    });

    // Evento: Atender en Ventanilla (eliminaCola)
    btnServe.addEventListener('click', () => {
        try {
            // Validar si la cola está vacía antes de atender
            if (banco.colaVacia()) {
                throw new Error('La cola está vacía. No hay clientes esperando para ser atendidos en ventanilla.');
            }

            const resultado = banco.eliminaCola();
            const cliente = resultado.cliente;

            // Actualizar tarjeta de último cliente atendido
            servedClientInfo.innerHTML = `
                <div class="fw-bold text-dark fs-6">Turno #${cliente.numeroTurno} - ${escapeHtml(cliente.nombreCliente)}</div>
                <div class="small text-muted">Movimiento: ${escapeHtml(cliente.tipoMovimiento)}</div>
                <div class="small text-success mt-1"><i class="fa-solid fa-stopwatch me-1"></i>Tiempo en espera: ${resultado.tiempoEsperaTexto}</div>
            `;

            // Configurar contenido del Modal
            attentionModalBody.innerHTML = `
                <div class="text-center mb-4">
                    <div class="display-5 text-success fw-bold">#${cliente.numeroTurno}</div>
                    <h4 class="text-dark mt-2">${escapeHtml(cliente.nombreCliente)}</h4>
                    <span class="badge bg-primary fs-6 mt-1">${escapeHtml(cliente.tipoMovimiento)}</span>
                </div>
                <ul class="list-group list-group-flush border rounded-3 bg-light">
                    <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent">
                        <span class="text-muted"><i class="fa-regular fa-clock me-2"></i>Hora de Llegada:</span>
                        <strong class="text-dark">${cliente.horaLlegada.toLocaleTimeString()}</strong>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent">
                        <span class="text-muted"><i class="fa-solid fa-clock-rotate-left me-2"></i>Hora de Atención:</span>
                        <strong class="text-dark">${resultado.horaAtencion.toLocaleTimeString()}</strong>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent">
                        <span class="text-muted"><i class="fa-solid fa-hourglass-half me-2"></i>Tiempo en Cola:</span>
                        <span class="badge bg-success fs-6">${resultado.tiempoEsperaTexto}</span>
                    </li>
                </ul>
            `;

            // Mostrar Modal de éxito
            attentionModal.show();

            // Actualizar UI
            actualizarUI();

        } catch (error) {
            mostrarAlerta(error.message, 'warning');
        }
    });

    // Evento: Reiniciar Cola
    btnReset.addEventListener('click', () => {
        if (confirm('¿Está seguro de reiniciar la cola de turnos? Se perderán los datos actuales.')) {
            banco.reiniciar();
            servedClientInfo.innerHTML = 'Ningún cliente ha sido atendido en esta sesión.';
            mostrarAlerta('La cola ha sido reiniciada correctamente.', 'info');
            actualizarUI();
        }
    });

    // Inicializar UI al cargar
    actualizarUI();
});
