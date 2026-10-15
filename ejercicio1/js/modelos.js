/** Producto del supermercado: cantidad y precio se generan aleatoriamente al crearse. */
class Producto {
  constructor(nombre) {
    this.nombre = nombre;
    this.cantidad = Math.floor(Math.random() * 50) + 1;                       // 1 a 50
    this.precio = Math.round((Math.random() * 199 + 1) * 100) / 100;          // $1.00 a $200.00
  }
}
