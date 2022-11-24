function probarHoisting(testType) {
  switch (testType) {
    case 'var':
      {
        console.log('PRUEBA Hoisting CON var')
        var varVal2 = 5;
        //  Imprimirá 'undefined'
        console.log('\tVar value #1', varVal1);
        //  Imprimirá '5'
        console.log('\tVar value #2', varVal2);
        var varVal1 = 10;
      }
      break;
    case 'let':
      {
        console.log('PRUEBA Hoisting CON let')
        let letVal2 = 5;
        try {
          //  Arrojará un error
          console.log('\tLet value #1', letVal1);
        }
        catch (err) {
          console.log('\tLet value #1', err.message);
        }
        //  Imprimirá '5'
        console.log('\tLet value #2', letVal2);
        let letVal1 = 10;
      }
      break;
    case 'const':
      {
        console.log('PRUEBA Hoisting CON const')
        let constVal2 = 5;
        try {
          //  Arrojará un error
          console.log('\tConst value #1', constVal1);
        }
        catch (err) {
          console.log('\tConst value #1', err.message);
        }
        //  Imprimirá '5'
        console.log('\tConst value #2', constVal2);
        let constVal1 = 10;
      }
      break;
  }
}

probarHoisting('var');
probarHoisting('let');
probarHoisting('const');