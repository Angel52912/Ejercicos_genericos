/** Ejercicio 3. Aprobados y reprobados. */
class Ejercicio3AprobadosReprobados {
  constructor() {
    this.alumnos = [];      // Lista principal (aún sin clasificar / aprobados)
    this.reprobados = [];   // Lista de reprobados (calificación menor que 7)
    this.clasificado = false;
    this.msg = new Mensajero($("lblMensaje"));
    $("frmAlumno").addEventListener("submit", e => { e.preventDefault(); this.msg.ejecutar(() => this.registrar()); });
    $("btnClasificar").addEventListener("click", () => this.msg.ejecutar(() => this.clasificar()));
    this.mostrar();
  }

  registrar() {
    const nombre = Validador.nombre($("txtAlumno").value, "el nombre del alumno");
    const cal = Validador.decimal($("txtCalificacion").value, "la calificación", 0, 10);
    this.alumnos.push(new Alumno(nombre, cal));
    this.msg.exito(`${nombre} registrado con calificación ${cal}.`);
    $("frmAlumno").reset(); $("txtAlumno").focus();
    this.mostrar();
  }

  /** Saca de la lista a los alumnos con calificación menor que 7 y los guarda en la lista de reprobados. */
  clasificar() {
    if (this.alumnos.length === 0 && this.reprobados.length === 0)
      throw new ErrorValidacion("No hay alumnos registrados.");
    for (const a of this.alumnos.filter(x => x.calificacion < 7)) {
      this.alumnos.splice(this.alumnos.indexOf(a), 1);
      this.reprobados.push(a);
    }
    this.clasificado = true;
    this.msg.exito("Alumnos clasificados: aprobados (7 en adelante) y reprobados (menor que 7).");
    this.mostrar();
  }

  mostrar() {
    const filas = l => l.map(a => [a.nombre, a.calificacion]);
    $("lblTotalAlumnos").textContent = this.alumnos.length;
    Vista.tabla($("tblAprobados"), this.clasificado ? filas(this.alumnos) : [], 2,
      this.clasificado ? "No hay alumnos aprobados" : "Aún sin clasificar");
    Vista.tabla($("tblReprobados"), this.clasificado ? filas(this.reprobados) : [], 2,
      this.clasificado ? "No hay alumnos reprobados" : "Aún sin clasificar");
  }
}

window.addEventListener("DOMContentLoaded", () => new Ejercicio3AprobadosReprobados());
