const yargs = require('yargs')
const procesaImagen = require('./imagenFunciones')

// Función asíncrona para procesar la imagen
async function procesarImagen() {
  try {
    // Configura los argumentos de la línea de comandos usando yargs
    const argv = yargs
      .usage('Usage: node app.js --input [filename] -s [new side size ]-c [compression] -b [Side blur]')
      .demandOption(['input']) // Requiere que los argumentos input y output sean proporcionados
      .argv

    // Lee el nombre del archivo de entrada y de salida desde los argumentos de la línea de comandos
    const inputFile = argv.input
    const size = argv.s ? argv.s:1000
    const compression = argv.c ? argv.c : 80
    const blur = argv.b ? argv.b: 40

    // Llama a procesaImagen.normalizaFotoCuadrada utilizando await
    await procesaImagen.normalizaFotoCuadrada(inputFile,blur, size, compression)

    // Muestra un mensaje de consola indicando que ha terminado
    console.log('Proceso completado.')
  } catch (error) {
    console.error('Error al procesar la imagen:', error)
  }
}

// Llama a la función asíncrona para procesar la imagen
procesarImagen()