/** Ejercicio 5. Listar palabras por letra. */
class Ejercicio5PalabrasPorLetra {
  constructor() {
    this.todas = [];    // Lista1 con todas las palabras capturadas
    this.listas = [];   // [{letra, palabras: []}], una lista por cada primera letra
    this.msg = new Mensajero($("lblMensaje"));
    $("frmPalabra").addEventListener("submit", e => { e.preventDefault(); this.msg.ejecutar(() => this.agregar()); });
    $("btnMostrar").addEventListener("click", () => this.msg.ejecutar(() => this.mostrar()));
  }

  /** Guarda la palabra y la coloca en la lista de su primera letra (crea la lista si no existe). */
  agregar() {
    const palabra = Validador.palabra($("txtPalabra").value, "la palabra");
    this.todas.push(palabra);
    const letra = palabra[0].toUpperCase();
    let lista = this.listas.find(l => l.letra === letra);
    let nueva = false;
    if (!lista) { lista = { letra, palabras: [] }; this.listas.push(lista); nueva = true; }
    lista.palabras.push(palabra);
    this.msg.exito(`Palabra agregada.${nueva ? ` Se creó una nueva lista para la letra ${letra}.` : ""}`);
    $("frmPalabra").reset(); $("txtPalabra").focus();
    this.mostrar();
  }

  mostrar() {
    if (this.todas.length === 0) throw new ErrorValidacion("No hay palabras registradas.");
    const cont = $("pnlListas"); cont.replaceChildren();
    const fila = (titulo, palabras) => {
      const d = document.createElement("div"); d.className = "lista-letra";
      const b = document.createElement("b"); b.textContent = titulo + ":";
      const c = document.createElement("span"); c.className = "chips"; Vista.chips(c, palabras);
      d.append(b, c); cont.append(d);
    };
    fila("Lista1", this.todas);
    this.listas.forEach((l, i) => fila(`Lista${i + 2} (${l.letra})`, l.palabras));
  }
}

window.addEventListener("DOMContentLoaded", () => new Ejercicio5PalabrasPorLetra());
