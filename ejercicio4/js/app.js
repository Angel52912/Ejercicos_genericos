/** Ejercicio 4. Eliminar y ordenar productos. */
class Ejercicio4EliminarOrdenar {
  constructor() {
    this.productos = [];   // Lista que almacena los datos
    this.visible = false;
    this.msg = new Mensajero($("lblMensaje"));
    $("frmProducto").addEventListener("submit", e => { e.preventDefault(); this.msg.ejecutar(() => this.agregar()); });
    $("frmEliminar").addEventListener("submit", e => { e.preventDefault(); this.msg.ejecutar(() => this.eliminar()); });
    $("btnMostrar").addEventListener("click", () => this.msg.ejecutar(() => this.mostrar(true)));
    this.mostrar();
  }

  agregar() {
    const clave = Validador.texto($("txtClave").value, "la clave del producto");
    const nombre = Validador.texto($("txtNombre").value, "el nombre del producto");
    const precio = Validador.decimal($("txtPrecio").value, "el precio", 0.01);
    if (this.productos.some(p => p.clave.toLowerCase() === clave.toLowerCase()))
      throw new ErrorValidacion("Ya existe un producto con esa clave.");
    this.productos.push(new ProductoCompra(clave, nombre, precio));
    this.msg.exito(`Producto "${nombre}" agregado.`);
    $("frmProducto").reset(); $("txtClave").focus();
    this.mostrar();
  }

  /** Elimina el producto cuya clave coincida con la solicitada al usuario. */
  eliminar() {
    if (this.productos.length === 0) throw new ErrorValidacion("No hay productos para eliminar.");
    const clave = Validador.texto($("txtClaveEliminar").value, "la clave a eliminar");
    const i = this.productos.findIndex(p => p.clave.toLowerCase() === clave.toLowerCase());
    if (i === -1) throw new ErrorValidacion("No existe un producto con esa clave.");
    const [p] = this.productos.splice(i, 1);
    this.msg.exito(`Producto "${p.nombre}" eliminado.`);
    $("frmEliminar").reset();
    this.mostrar();
  }

  /** Muestra los productos ordenados por nombre y el costo total de compra. */
  mostrar(forzar = false) {
    if (forzar) {
      if (this.productos.length === 0) throw new ErrorValidacion("No hay productos registrados.");
      this.visible = true;
    }
    const lista = this.visible
      ? [...this.productos].sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }))
      : [];
    Vista.tabla($("tblProductos"), lista.map(p => [p.clave, p.nombre, Vista.dinero(p.precio)]), 3,
      "Pulsa «Mostrar ordenados» para ver la lista");
    $("lblTotal").textContent = Vista.dinero(this.visible ? this.productos.reduce((s, p) => s + p.precio, 0) : 0);
  }
}

window.addEventListener("DOMContentLoaded", () => new Ejercicio4EliminarOrdenar());
