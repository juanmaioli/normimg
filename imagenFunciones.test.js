const { normalizaFotoCuadrada } = require('./imagenFunciones');
const fs = require('fs/promises');
const path = require('path');
const Jimp = require('jimp');

// Directorio para los archivos de prueba
const testDir = path.join(__dirname, 'test-assets');
const inputPath = path.join(testDir, 'test-image.png');
const outputPath = path.join(testDir, 'test-output.jpg');

describe('normalizaFotoCuadrada', () => {
  // Antes de todas las pruebas, crea el directorio y una imagen de prueba
  beforeAll(async () => {
    await fs.mkdir(testDir, { recursive: true });
    // Crea una imagen simple (20x40) para la prueba
    const jimpInstance = Jimp.default || Jimp;
    const image = new jimpInstance(20, 40, '#ff0000'); // Una imagen roja no cuadrada
    await image.writeAsync(inputPath);
  });

  // Después de todas las pruebas, limpia el directorio
  afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  // Prueba 1: Proceso exitoso
  test('debería crear una imagen cuadrada con las dimensiones correctas', async () => {
    const size = 200;
    const quality = 90;
    const blur = 50;

    await normalizaFotoCuadrada(inputPath, outputPath, blur, size, quality);

    // Verifica que el archivo de salida existe
    const stats = await fs.stat(outputPath);
    expect(stats.isFile()).toBe(true);

    // Verifica las dimensiones de la imagen de salida
    const jimpInstance = Jimp.default || Jimp;
    const outputImage = await jimpInstance.read(outputPath);
    expect(outputImage.getWidth()).toBe(size);
    expect(outputImage.getHeight()).toBe(size);
  });

  // Prueba 2: Manejo de errores
  test('debería lanzar un error si el archivo de entrada no existe', async () => {
    const nonExistentInput = path.join(testDir, 'no-existe.png');
    
    // Espera que la promesa sea rechazada con un error
    await expect(
      normalizaFotoCuadrada(nonExistentInput, outputPath, 40, 1000, 80)
    ).rejects.toThrow();
  });
});
