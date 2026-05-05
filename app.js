const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const path = require('path');
const fs = require('fs/promises');
const { normalizaFoto, normalizaFotoCuadradaFondoBlanco, convertirPngAJpg } = require('./imagenFunciones');

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
        describe: 'Tamaño del lado (para formato cuadrado). Ignorado si se usan -w y -h.',
        type: 'number'
      })
      .option('w', {
        alias: 'width',
        describe: 'Ancho final en píxeles',
        type: 'number'
      })
      .option('H', {
        alias: 'height',
        describe: 'Alto final en píxeles',
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
      .option('W', {
        alias: 'white',
        default: false,
        describe: 'Usar fondo blanco sólido en lugar de desenfocado (ignora size/width/height y usa el lado más largo)',
        type: 'boolean'
      })
      .option('P', {
        alias: 'convert',
        default: false,
        describe: 'Solo convertir PNG a JPG (sin redimensionar)',
        type: 'boolean'
      })
      .help('h')
      .alias('h', 'help')
      .argv;

    const inputPath = argv.input;
    const { blur, size, compression, width, height, white, convert } = argv;
    
    // Determinar dimensiones finales
    // Si se especifican width o height, se usan esos. Si se usa size, se usa para los faltantes.
    // Si no se especifica nada, se pasan como undefined para usar el tamaño original.
    const finalWidth = width || size;
    const finalHeight = height || size;
    const dimensionLog = (finalWidth && finalHeight) ? `${finalWidth}x${finalHeight}px` : 'Original';

    const stats = await fs.stat(inputPath);

    if (stats.isDirectory()) {
      // --- LÓGICA PARA PROCESAMIENTO POR LOTES ---
      console.log(`🔍 Procesando directorio: ${inputPath}`);
      const outputDir = argv.output || 'output'; // Directorio de salida por defecto
      await fs.mkdir(outputDir, { recursive: true });

      let files = await fs.readdir(inputPath);
      let imageFiles = files.filter(file => /\.(jpg|jpeg|png|bmp|gif)$/i.test(file));

      // Si convert está activo, solo procesamos PNGs
      if (convert) {
        imageFiles = imageFiles.filter(file => /\.png$/i.test(file));
      }

      if (imageFiles.length === 0) {
        console.log('🤷 No se encontraron imágenes válidas en el directorio.');
        return;
      }

      console.log(`🖼️  Se encontraron ${imageFiles.length} imágenes. Procesando...`);

      const processingPromises = imageFiles.map(file => {
        const inputFile = path.join(inputPath, file);
        const outputFile = path.join(outputDir, `${path.parse(file).name}${convert ? '.jpg' : '_procesada.jpg'}`);
        
        if (convert) {
          return convertirPngAJpg(inputFile, outputFile, compression)
            .then(() => console.log(`  ✓ ${file} -> ${outputFile} (Conversión)`))
            .catch(err => console.error(`  ✗ Error con ${file}: ${err.message}`));
        } else if (white) {
          return normalizaFotoCuadradaFondoBlanco(inputFile, outputFile, compression)
            .then(() => console.log(`  ✓ ${file} -> ${outputFile} (Fondo Blanco)`))
            .catch(err => console.error(`  ✗ Error con ${file}: ${err.message}`));
        } else {
          return normalizaFoto(inputFile, outputFile, blur, finalWidth, finalHeight, compression)
            .then(() => console.log(`  ✓ ${file} -> ${outputFile} (${dimensionLog})`))
            .catch(err => console.error(`  ✗ Error con ${file}: ${err.message}`));
        }
      });

      await Promise.all(processingPromises);
      console.log(`\n✅ Proceso por lotes completado. Las imágenes se guardaron en: ${outputDir}`);

    } else if (stats.isFile()) {
      // --- LÓGICA PARA ARCHIVO ÚNICO ---
      const outputFile = argv.output || (() => {
        const parsedPath = path.parse(inputPath);
        return path.join(parsedPath.dir, `${parsedPath.name}${convert ? '.jpg' : '_final' + parsedPath.ext}`);
      })();

      if (convert) {
        console.log(`🖼️  Convirtiendo archivo a JPG: ${inputPath}...`);
        await convertirPngAJpg(inputPath, outputFile, compression);
      } else if (white) {
        console.log(`🖼️  Procesando archivo con fondo blanco: ${inputPath}...`);
        await normalizaFotoCuadradaFondoBlanco(inputPath, outputFile, compression);
      } else {
        console.log(`🖼️  Procesando archivo: ${inputPath} a ${dimensionLog}...`);
        await normalizaFoto(inputPath, outputFile, blur, finalWidth, finalHeight, compression);
      }
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