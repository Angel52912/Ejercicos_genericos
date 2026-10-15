/** Acceso rápido a elementos del DOM por id. */
const $ = id => document.getElementById(id);

/** Excepción propia para los errores de captura de datos. */
class ErrorValidacion extends Error {
  constructor(mensaje) { super(mensaje); this.name = "ErrorValidacion"; }
}

/** Validación de entradas: lanza ErrorValidacion con un mensaje claro. */
class Validador {
  static cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  static texto(valor, campo) {
    const t = (valor ?? "").trim();
    if (!t) throw new ErrorValidacion(`Hay datos faltantes: escribe ${campo}.`);
    return t;
  }
  /** Número decimal (acepta punto o coma) dentro de un rango. */
  static decimal(valor, campo, min = -Infinity, max = Infinity) {
    const t = Validador.texto(valor, campo).replace(",", ".");
    if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(t)) throw new ErrorValidacion(`Introducir sólo números en ${campo}.`);
    const n = Number(t);
    if (n < min || n > max) throw new ErrorValidacion(`${Validador.cap(campo)} debe estar entre ${min} y ${max}.`);
    return n;
  }
  static entero(valor, campo, min, max) {
    const n = Validador.decimal(valor, campo, min, max);
    if (!Number.isInteger(n)) throw new ErrorValidacion(`${Validador.cap(campo)} debe ser un número entero.`);
    return n;
  }
  static palabra(valor, campo) {
    const t = Validador.texto(valor, campo);
    if (!/^\p{L}+$/u.test(t)) throw new ErrorValidacion("Introducir sólo letras, sin espacios, números ni símbolos.");
    return t;
  }
  /** Nombre completo: sólo letras y espacios (no admite números ni símbolos). */
  static nombre(valor, campo) {
    let t = Validador.texto(valor, campo).replace(/\s+/g, " ").trim();
    if (!/^\p{L}+( \p{L}+)*$/u.test(t))
      throw new ErrorValidacion("El nombre del alumno debe contener sólo letras (sin números ni símbolos).");
    return t;
  }
}

/** Muestra mensajes de éxito o error en una etiqueta. */
class Mensajero {
  constructor(lbl) { this.lbl = lbl; }
  exito(t) { this.lbl.className = "mensaje exito"; this.lbl.textContent = t; }
  error(t) { this.lbl.className = "mensaje error"; this.lbl.textContent = t; }
  limpiar() { this.lbl.className = "mensaje"; this.lbl.textContent = ""; }
  /** Ejecuta una acción y muestra el error de validación si ocurre. */
  ejecutar(accion) {
    try { accion(); }
    catch (e) {
      if (e instanceof ErrorValidacion) this.error(e.message);
      else { this.error("Ocurrió un error inesperado."); console.error(e); }
    }
  }
}

/** Utilidades para dibujar tablas y listas (usa textContent, sin HTML inyectado). */
class Vista {
  static tabla(tbody, filas, columnas, vacio = "Sin datos") {
    tbody.replaceChildren();
    if (filas.length === 0) {
      const tr = tbody.insertRow(); tr.className = "vacio";
      const td = tr.insertCell(); td.colSpan = columnas; td.textContent = vacio;
      return;
    }
    for (const fila of filas) {
      const tr = tbody.insertRow();
      fila.forEach(v => { tr.insertCell().textContent = v; });
    }
  }
  static chips(cont, items, vacio = "(ninguno)") {
    cont.replaceChildren();
    if (items.length === 0) {
      const s = document.createElement("span"); s.className = "vacio"; s.textContent = vacio; cont.append(s); return;
    }
    for (const i of items) {
      const s = document.createElement("span"); s.className = "chip"; s.textContent = i; cont.append(s);
    }
  }
  static dinero(n) { return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n); }
}
