const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const path = require('path');
const fs = require('fs/promises');
const { normalizaFotoCuadrada } = require('./imagenFunciones');

// Función asíncrona principal
async function main() {
  try {
    // Configura los argumentos de la línea de comandos usando yargs
    const argv = yargs(hideBin(process.argv))
      .usage('Usage: $0 --input <file_or_dir> [options]')
      .option('i', {
        alias: 'input',
        demandOption: true,
        describe: 'Ruta del archivo o directorio de entrada',
        type: 'string'
      })
      .option('o', {
        alias: 'output',
        describe: 'Ruta del archivo o directorio de salida',
        type: 'string'
      })
      .option('s', {
        alias: 'size',
        default: 1000,
        describe: 'Tamaño en píxeles del lado de la imagen final',
        type: 'number'
      })
      .option('c', {
        alias: 'compression',
        default: 80,
        describe: 'Calidad de la compresión JPG (0-100)',
        type: 'number'
      })
      .option('b', {
        alias: 'blur',
        default: 40,
        describe: 'Nivel de desenfoque para el fondo (0-100)',
        type: 'number'
      })
      .help('h')
      .alias('h', 'help')
      .argv;

    const inputPath = argv.input;
    const { blur, size, compression } = argv;
    const stats = await fs.stat(inputPath);

    if (stats.isDirectory()) {
      // --- LÓGICA PARA PROCESAMIENTO POR LOTES ---
      console.log(`🔍 Procesando directorio: ${inputPath}`);
      const outputDir = argv.output || 'output'; // Directorio de salida por defecto
      await fs.mkdir(outputDir, { recursive: true });

      const files = await fs.readdir(inputPath);
      const imageFiles = files.filter(file => /\.(jpg|jpeg|png|bmp|gif)$/i.test(file));

      if (imageFiles.length === 0) {
        console.log('🤷 No se encontraron imágenes en el directorio.');
        return;
      }

      console.log(`🖼️  Se encontraron ${imageFiles.length} imágenes. Procesando...`);

      const processingPromises = imageFiles.map(file => {
        const inputFile = path.join(inputPath, file);
        const outputFile = path.join(outputDir, `${path.parse(file).name}_cuadrada.jpg`);
        return normalizaFotoCuadrada(inputFile, outputFile, blur, size, compression)
          .then(() => console.log(`  ✓ ${file} -> ${outputFile}`))
          .catch(err => console.error(`  ✗ Error con ${file}: ${err.message}`));
      });

      await Promise.all(processingPromises);
      console.log(`\n✅ Proceso por lotes completado. Las imágenes se guardaron en: ${outputDir}`);

    } else if (stats.isFile()) {
      // --- LÓGICA PARA ARCHIVO ÚNICO ---
      const outputFile = argv.output || (() => {
        const parsedPath = path.parse(inputPath);
        return path.join(parsedPath.dir, `${parsedPath.name}_final${parsedPath.ext}`);
      })();

      console.log(`🖼️  Procesando archivo: ${inputPath}...`);
      await normalizaFotoCuadrada(inputPath, outputFile, blur, size, compression);
      console.log(`✅ Proceso completado. Imagen guardada en: ${outputFile}`);
    
    } else {
        throw new Error(`La ruta de entrada no es un archivo ni un directorio válido.`);
    }

  } catch (error) {
    if (error.code === 'ENOENT') {
        console.error(`❌ Error: La ruta de entrada '${error.path}' no existe.`);
    } else {
        console.error('❌ Error inesperado:', error.message);
    }
  }
}

// Llama a la función principal
main();