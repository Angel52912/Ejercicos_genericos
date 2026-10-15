/** Ejercicio 2. Pares e impares. */
class Ejercicio2ParesImpares {
  constructor() {
    this.msg = new Mensajero($("lblMensaje"));
    $("frmPares").addEventListener("submit", e => { e.preventDefault(); this.msg.ejecutar(() => this.generar()); });
  }

  /** Genera la lista aleatoria y la separa en pares e impares. */
  generar() {
    const cantidad = Validador.entero($("txtCantidad").value, "la cantidad de números", 1, 100);
    const numeros = [], pares = [], impares = [];
    for (let i = 0; i < cantidad; i++) numeros.push(Math.floor(Math.random() * 100) + 1);
    for (const n of numeros) (n % 2 === 0 ? pares : impares).push(n);
    Vista.chips($("lblGenerados"), numeros);
    Vista.chips($("lblPares"), pares);
    Vista.chips($("lblImpares"), impares);
    this.msg.exito(`Se generaron ${cantidad} números: ${pares.length} pares y ${impares.length} impares.`);
  }
}

window.addEventListener("DOMContentLoaded", () => new Ejercicio2ParesImpares());
