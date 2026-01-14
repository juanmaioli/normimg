const { normalizaFoto } = require('./imagenFunciones');
const fs = require('fs/promises');
const path = require('path');
const Jimp = require('jimp');

// Directorio para los archivos de prueba
const testDir = path.join(__dirname, 'test-assets');
const inputPath = path.join(testDir, 'test-image.png');
const outputPath = path.join(testDir, 'test-output.jpg');
const outputRectPath = path.join(testDir, 'test-output-rect.jpg');

describe('normalizaFoto', () => {
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

  // Prueba 1: Proceso exitoso (Cuadrado - Backward Compatibility Logic check)
  test('debería crear una imagen cuadrada con las dimensiones correctas', async () => {
    const size = 200;
    const quality = 90;
    const blur = 50;

    await normalizaFoto(inputPath, outputPath, blur, size, size, quality);

    // Verifica que el archivo de salida existe
    const stats = await fs.stat(outputPath);
    expect(stats.isFile()).toBe(true);

    // Verifica las dimensiones de la imagen de salida
    const jimpInstance = Jimp.default || Jimp;
    const outputImage = await jimpInstance.read(outputPath);
    expect(outputImage.getWidth()).toBe(size);
    expect(outputImage.getHeight()).toBe(size);
  });

  // Prueba 2: Proceso exitoso (Rectangular - Nueva funcionalidad)
  test('debería crear una imagen rectangular con las dimensiones correctas', async () => {
    const width = 300;
    const height = 150;
    const quality = 90;
    const blur = 50;

    await normalizaFoto(inputPath, outputRectPath, blur, width, height, quality);

    // Verifica que el archivo de salida existe
    const stats = await fs.stat(outputRectPath);
    expect(stats.isFile()).toBe(true);

    // Verifica las dimensiones de la imagen de salida
    const jimpInstance = Jimp.default || Jimp;
    const outputImage = await jimpInstance.read(outputRectPath);
    expect(outputImage.getWidth()).toBe(width);
    expect(outputImage.getHeight()).toBe(height);
  });

  // Prueba 3: Manejo de errores
  test('debería lanzar un error si el archivo de entrada no existe', async () => {
    const nonExistentInput = path.join(testDir, 'no-existe.png');
    
    // Espera que la promesa sea rechazada con un error
    await expect(
      normalizaFoto(nonExistentInput, outputPath, 40, 1000, 1000, 80)
    ).rejects.toThrow();
  });
});