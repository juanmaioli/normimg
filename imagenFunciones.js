const Jimp = require('jimp')

/**
 * Normaliza una imagen a un formato específico (ancho x alto).
 * Crea un fondo con la imagen original desenfocada y la centra.
 * Todo el proceso se realiza en memoria para mayor eficiencia.
 * @param {string} urlImagen Ruta de la imagen de entrada.
 * @param {string} urlImagenFinal Ruta de la imagen de salida.
 * @param {number} desenfoque Nivel de desenfoque para el fondo (0-100).
 * @param {number} ancho Ancho en píxeles de la imagen final.
 * @param {number} alto Alto en píxeles de la imagen final.
 * @param {number} calidad Calidad de la compresión JPG (0-100).
 */
async function normalizaFoto(urlImagen, urlImagenFinal, desenfoque = 40, ancho = 1000, alto = 1000, calidad = 80) {
  try {
    // 1. Lee la imagen original una sola vez, manejando el cambio de API en Jimp v1
    const jimpInstance = Jimp.default || Jimp;
    const imagenOriginal = await jimpInstance.read(urlImagen);

    // 2. Clona la imagen original para crear el fondo
    const fondo = imagenOriginal.clone();

    // 3. Procesa el fondo: desenfoque y redimensión al tamaño objetivo
    // Al hacer resize directo a (ancho, alto), la imagen se estira para cubrir todo el lienzo,
    // lo cual es deseable para el efecto de fondo desenfocado.
    fondo.blur(desenfoque);
    fondo.resize(ancho, alto);

    // 4. Redimensiona la imagen original para que quepa dentro del nuevo lienzo (contain)
    // manteniendo su relación de aspecto.
    imagenOriginal.scaleToFit(ancho, alto);

    // 5. Superpone la imagen original centrada sobre el fondo
    const x = (ancho - imagenOriginal.getWidth()) / 2;
    const y = (alto - imagenOriginal.getHeight()) / 2;
    fondo.composite(imagenOriginal, x, y);

    // 6. Ajusta la calidad de la imagen final
    fondo.quality(calidad);

    // 7. Escribe el archivo final una sola vez
    await fondo.writeAsync(urlImagenFinal);

  } catch (error) {
    // Si algo falla, lanza el error para que sea capturado en app.js
    throw new Error(`Error al procesar la imagen ${urlImagen}: ${error.message}`);
  }
}

module.exports = {
  normalizaFoto,
}
