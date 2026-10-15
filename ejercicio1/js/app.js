/** Ejercicio 1. Productos disponibles y retirados. */
class Ejercicio1Productos {
  constructor() {
    this.disponibles = [];   // Lista de productos en el almacén
    this.retirados = [];     // Lista de productos retirados
    this.contador = 0;
    this.msg = new Mensajero($("lblMensaje"));
    $("btnEscanear").addEventListener("click", () => this.msg.ejecutar(() => this.escanear()));
    $("frmRetirar").addEventListener("submit", e => { e.preventDefault(); this.msg.ejecutar(() => this.retirar()); });
    this.mostrar();
  }

  /** Escanea un producto nuevo: nombre básico producto1, producto2, ... */
  escanear() {
    const p = new Producto(`producto${++this.contador}`);
    this.disponibles.push(p);
    this.msg.exito(`${p.nombre} escaneado: ${p.cantidad} piezas a ${Vista.dinero(p.precio)}.`);
    this.mostrar();
  }

  /** Retira un producto del almacén (pasa de la lista de disponibles a la de retirados). */
  retirar() {
    const nombre = Validador.texto($("cboRetirar").value, "el producto a retirar");
    const p = this.disponibles.find(x => x.nombre === nombre);
    if (!p) throw new ErrorValidacion("Ese producto no existe en el almacén.");
    this.disponibles.splice(this.disponibles.indexOf(p), 1);
    this.retirados.push(p);
    this.msg.exito(`${p.nombre} retirado correctamente.`);
    this.mostrar();
  }

  mostrar() {
    const filas = l => l.map(p => [p.nombre, p.cantidad, Vista.dinero(p.precio)]);
    Vista.tabla($("tblDisponibles"), filas(this.disponibles), 3, "No hay productos disponibles");
    Vista.tabla($("tblRetirados"), filas(this.retirados), 3, "No hay productos retirados");
    $("lblDisponibles").textContent = this.disponibles.length;
    $("lblRetirados").textContent = this.retirados.length;
    const cbo = $("cboRetirar");
    cbo.replaceChildren(new Option("-- Selecciona --", ""));
    this.disponibles.forEach(p => cbo.add(new Option(p.nombre, p.nombre)));
  }
}

window.addEventListener("DOMContentLoaded", () => new Ejercicio1Productos());
