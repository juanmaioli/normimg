const yargs = require('yargs');
const path = require('path');
const { normalizaFotoCuadrada } = require('./imagenFunciones');

// Función asíncrona principal
async function main() {
  try {
    // Configura los argumentos de la línea de comandos usando yargs
    const argv = yargs
      .usage('Usage: $0 --input <filename> [options]')
      .option('i', {
        alias: 'input',
        demandOption: true,
        describe: 'Input image file path',
        type: 'string'
      })
      .option('o', {
        alias: 'output',
        describe: 'Output image file path',
        type: 'string'
      })
      .option('s', {
        alias: 'size',
        default: 1000,
        describe: 'Side size of the final square image in pixels',
        type: 'number'
      })
      .option('c', {
        alias: 'compression',
        default: 80,
        describe: 'JPG compression quality (0-100)',
        type: 'number'
      })
      .option('b', {
        alias: 'blur',
        default: 40,
        describe: 'Blur level for the background (0-100)',
        type: 'number'
      })
      .help('h')
      .alias('h', 'help')
      .argv;

    // Define la ruta de entrada
    const inputFile = argv.input;

    // Define la ruta de salida. Si no se proporciona, crea un nombre por defecto.
    const outputFile = argv.output || (() => {
      const inputPath = path.parse(inputFile);
      return path.join(inputPath.dir, `${inputPath.name}_final${inputPath.ext}`);
    })();

    // Lee las opciones de procesamiento
    const { blur, size, compression } = argv;

    console.log(`Procesando ${inputFile}...`);

    // Llama a la función de procesamiento de imagen con los argumentos correctos
    await normalizaFotoCuadrada(inputFile, outputFile, blur, size, compression);

    console.log('✅ Proceso completado.');
    console.log(`Imagen guardada en: ${outputFile}`);

  } catch (error) {
    console.error('❌ Error al procesar la imagen:', error.message);
  }
}

// Llama a la función principal
main();