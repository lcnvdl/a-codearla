function funcionConCallbackVar(callback) {
  for (var i = 0; i < 5; i++) {
    setTimeout(() => {
      callback(i);
    });
  }

  try {
    console.log('Afuera del for: ' + i);
  }
  catch (err) {
    console.log('Afuera del for: ' + err.message);
  }
}

function funcionConCallbackLet(callback) {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      callback(i);
    });
  }

  try {
    console.log('Afuera del for: ' + i);
  }
  catch (err) {
    console.log('Afuera del for: ' + err.message);
  }
}

funcionConCallbackVar(m => console.log(`Var: ${m}`));
funcionConCallbackLet(m => console.log(`Let: ${m}`));
