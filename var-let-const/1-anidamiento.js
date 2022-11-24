var condicion = true;

function nombreLet() {
  let nombre = 'Pedro';

  if (condicion) {
    let nombre = 'Firulais';
    console.log('El perro de LET es ' + nombre);
  }

  return nombre;
}

function nombreVar() {
  var nombre = 'Pedro';

  if (condicion) {
    var nombre = 'Firulais';
    console.log('El perro de VAR es ' + nombre);
  }

  return nombre;
}

console.log('La persona de VAR es: ' + nombreVar());

console.log('La persona de LET es: ' + nombreLet());
