const Jimp = require('jimp')

/**
 * Normaliza una imagen a un formato cuadrado.
 * Crea un fondo con la imagen original desenfocada y la centra.
 * Todo el proceso se realiza en memoria para mayor eficiencia.
 * @param {string} urlImagen Ruta de la imagen de entrada.
 * @param {string} urlImagenFinal Ruta de la imagen de salida.
 * @param {number} desenfoque Nivel de desenfoque para el fondo (0-100).
 * @param {number} tamanioLado Tamaño en píxeles del lado de la imagen final.
 * @param {number} calidad Calidad de la compresión JPG (0-100).
 */
async function normalizaFotoCuadrada(urlImagen, urlImagenFinal, desenfoque = 40, tamanioLado = 1000, calidad = 80) {
  try {
    // 1. Lee la imagen original una sola vez, manejando el cambio de API en Jimp v1
    const jimpInstance = Jimp.default || Jimp;
    const imagenOriginal = await jimpInstance.read(urlImagen);

    // 2. Clona la imagen original para crear el fondo
    const fondo = imagenOriginal.clone();

    // 3. Procesa el fondo: desenfoque y redimensión a un cuadrado
    const nuevoTamanio = Math.max(fondo.bitmap.width, fondo.bitmap.height);
    fondo.blur(desenfoque);
    fondo.resize(nuevoTamanio, nuevoTamanio);

    // 4. Superpone la imagen original centrada sobre el fondo
    const x = (nuevoTamanio - imagenOriginal.getWidth()) / 2;
    const y = (nuevoTamanio - imagenOriginal.getHeight()) / 2;
    fondo.composite(imagenOriginal, x, y);

    // 5. Ajusta la imagen final al tamaño y calidad deseados
    fondo.resize(tamanioLado, tamanioLado);
    fondo.quality(calidad);

    // 6. Escribe el archivo final una sola vez
    await fondo.writeAsync(urlImagenFinal);

  } catch (error) {
    // Si algo falla, lanza el error para que sea capturado en app.js
    throw new Error(`Error al procesar la imagen ${urlImagen}: ${error.message}`);
  }
}

module.exports = {
  normalizaFotoCuadrada,
}
