const fs = require('fs')
const Jimp = require('jimp')
const delay = ms => new Promise(res => setTimeout(res, ms))

module.exports ={
  normalizaFotoCuadrada:normalizaFotoCuadrada,
  agregaLogo:agregaLogo,
  comprimeImagen:comprimeImagen,
}

// 01) tratamiento de imagen jpg o png, reduce calidad,tamaño, normaliza tamaño a 1000px x 1000px y si es necesario agrega franjas con blur
async function  normalizaFotoCuadrada(urlImagen,desenfoque = 40,tamanioLado = 1000,calidad = 80) {
  const extension = urlImagen.split('.').pop()
  const urlImagenFondo = urlImagen.replace('.' + extension, '') + '_blur.jpg'
  const urlImagenSuperpuesta = urlImagen.replace('.' + extension, '') + '_superpuesta.jpg'
  const urlImagenFinal = urlImagen.replace('.' + extension, '') + '_final.jpg'
  // Abrir la imagen y aplicar el desenfoque
  try {
    const imagen = await Jimp.read(urlImagen)
    const nivelDeDesenfoque = desenfoque
    imagen.blur(nivelDeDesenfoque)
    const nuevoTamanio = Math.max(imagen.bitmap.height, imagen.bitmap.width)
    imagen.resize(nuevoTamanio, nuevoTamanio)
    imagen.write(urlImagenFondo)
  } catch (error) {
    console.error('Error:', error)
  }
  // await delay(500)
  // Arma la imagen Superpuesta
  try {
    const imagenOriginal = await Jimp.read(urlImagen)
    const imagenFondo = await Jimp.read(urlImagenFondo)
    const anchoFondo = imagenFondo.getWidth()
    const altoFondo = imagenFondo.getHeight()
    const x = (anchoFondo - imagenOriginal.getWidth()) / 2
    const y = (altoFondo - imagenOriginal.getHeight()) / 2

    imagenFondo.composite(imagenOriginal, x, y)
    await imagenFondo.write(urlImagenSuperpuesta)
  } catch (error) {
    console.error('Error:', error)
  }
  await delay(500)
  //Optimiza la imagen Superpuesta
  try{
    const imagenSuperpuesta = await Jimp.read(urlImagenSuperpuesta)
    imagenSuperpuesta.resize(tamanioLado, tamanioLado)
    imagenSuperpuesta.quality(calidad)
    imagenSuperpuesta.write(urlImagenFinal)
  } catch (error) {
    console.error('Error:', error)
  }
  // fs.unlink(urlImagen,() => {})
  fs.unlink(urlImagenFondo,() => {})
  fs.unlink(urlImagenSuperpuesta,() => {})
  // await delay(500)
}
//Función para agregar logo en la parte inferior derecha
async function agregaLogo(urlImagen,logo = 'ops',margenDerecho = 50,margenInferior = 50){
  const logoLista ={
    'ops':`./img/192x192.png`,
    'tecfield':`./img/TECFIELD.png`

  }
  const logoUsar = logoLista[logo]
  const extension = urlImagen.split('.').pop()
  const urlImagenFinal = urlImagen.replace('.' + extension, '') + '_final.jpg'
  try {
    const imagenLogo = await Jimp.read(logoUsar)
    const imagenFondo = await Jimp.read(urlImagen)
    const anchoFondo = imagenFondo.getWidth()
    const altoFondo = imagenFondo.getHeight()
    const x = (anchoFondo - imagenLogo.getWidth()) - margenDerecho
    const y = (altoFondo - imagenLogo.getHeight()) - margenInferior

    imagenFondo.composite(imagenLogo, x, y)
    console.log('x, y: ', x, y)
    await imagenFondo.write(urlImagenFinal)

  } catch (error) {
    console.error('Error:', error)
  }
  // await delay(500)
  fs.unlink(urlImagen,() => {})
  // await delay(500)
  fs.rename(urlImagenFinal, urlImagen, (err) => {
    if (err) {
      return
    }
  })
}
//Función para comprimir imagen
async function comprimeImagen(urlImagen, calidad = 80){
  const extension = urlImagen.split('.').pop()
  const urlImagenFinal = urlImagen.replace('.' + extension, '') + '_final.jpg'
  try {
    const imagen = await Jimp.read(urlImagen)
    imagen.quality(calidad)
    await imagen.write(urlImagenFinal)
  } catch (error) {
    console.error('Error:', error)
  }
  // await delay(500)
  fs.unlink(urlImagen,() => {})
  // await delay(500)
  fs.rename(urlImagenFinal, urlImagen, (err) => {
    if (err) {
      return
    }
  })
}
