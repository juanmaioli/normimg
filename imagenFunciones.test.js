const { normalizaFoto, normalizaFotoCuadradaFondoBlanco, convertirPngAJpg } = require('./imagenFunciones');
const fs = require('fs/promises');
const path = require('path');
const Jimp = require('jimp');

// Directorio para los archivos de prueba
const testDir = path.join(__dirname, 'test-assets');
const inputPath = path.join(testDir, 'test-image.png');
const inputPngPath = path.join(testDir, 'test-transparency.png');
const outputPath = path.join(testDir, 'test-output.jpg');
const outputRectPath = path.join(testDir, 'test-output-rect.jpg');
const outputWhitePath = path.join(testDir, 'test-output-white.jpg');
const outputConvertPath = path.join(testDir, 'test-output-convert.jpg');

describe('imagenFunciones', () => {
  // Antes de todas las pruebas, crea el directorio y una imagen de prueba
  beforeAll(async () => {
    await fs.mkdir(testDir, { recursive: true });
    
    const jimpInstance = Jimp.default || Jimp;
    
    // Crea una imagen simple (20x40) para la prueba (roja)
    const image = new jimpInstance(20, 40, '#ff0000');
    await image.writeAsync(inputPath);

    // Crea una imagen con transparencia (RGBA)
    const imagePng = new jimpInstance(50, 50, 0x00000000); // Transparente
    // Ponemos un pixel rojo en el centro
    imagePng.setPixelColor(0xFF0000FF, 25, 25);
    await imagePng.writeAsync(inputPngPath);
  });

  // Después de todas las pruebas, limpia el directorio
  afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('normalizaFoto', () => {
    // ... (pruebas existentes)
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

    // Prueba 3: Dimensiones originales por defecto
    test('debería usar las dimensiones originales si no se proporcionan ancho ni alto', async () => {
      const quality = 90;
      const blur = 10;

      // La imagen original creada en beforeAll es de 20x40
      await normalizaFoto(inputPath, outputPath, blur, null, null, quality);

      const jimpInstance = Jimp.default || Jimp;
      const outputImage = await jimpInstance.read(outputPath);
      
      expect(outputImage.getWidth()).toBe(20);
      expect(outputImage.getHeight()).toBe(40);
    });

    // Prueba 4: Manejo de errores
    test('debería lanzar un error si el archivo de entrada no existe', async () => {
      const nonExistentInput = path.join(testDir, 'no-existe.png');
      
      // Espera que la promesa sea rechazada con un error
      await expect(
        normalizaFoto(nonExistentInput, outputPath, 40, null, null, 80)
      ).rejects.toThrow();
    });
  });

  describe('normalizaFotoCuadradaFondoBlanco', () => {
    test('debería crear una imagen cuadrada con fondo blanco basada en el lado más largo', async () => {
      await normalizaFotoCuadradaFondoBlanco(inputPath, outputWhitePath, 90);

      // Verifica que el archivo de salida existe
      const stats = await fs.stat(outputWhitePath);
      expect(stats.isFile()).toBe(true);

      const jimpInstance = Jimp.default || Jimp;
      const outputImage = await jimpInstance.read(outputWhitePath);

      // La imagen de entrada era 20x40, el lado más largo es 40
      expect(outputImage.getWidth()).toBe(40);
      expect(outputImage.getHeight()).toBe(40);

      // Verificar que el fondo es blanco (en alguna esquina donde no esté la imagen roja original)
      // La imagen roja original de 20x40 está centrada en 40x40.
      // x = (40-20)/2 = 10. y = (40-40)/2 = 0.
      // Así que en (0,0) debería ser blanco.
      const color = outputImage.getPixelColor(0, 0);
      // Jimp.rgbaToInt(255, 255, 255, 255) es 0xFFFFFFFF, pero Jimp a veces lo devuelve como signed int o algo.
      // 0xFFFFFFFF es -1 en 2's complement para 32-bit signed.
      // Una forma segura es comparar con el valor hexadecimal.
      expect(color).toBe(0xFFFFFFFF);
      });
      });

      describe('convertirPngAJpg', () => {
      test('debería convertir una imagen PNG a JPG y rellenar transparencia con blanco', async () => {
      await convertirPngAJpg(inputPngPath, outputConvertPath, 90);

      // Verifica que el archivo de salida existe
      const stats = await fs.stat(outputConvertPath);
      expect(stats.isFile()).toBe(true);

      const jimpInstance = Jimp.default || Jimp;
      const outputImage = await jimpInstance.read(outputConvertPath);

      // Verificar que el fondo (antes transparente) ahora es blanco
      const colorEsquina = outputImage.getPixelColor(0, 0);
      expect(colorEsquina).toBe(0xFFFFFFFF);

      const colorCentro = outputImage.getPixelColor(25, 25);
      const rgba = jimpInstance.intToRGBA(colorCentro);

      expect(rgba.a).toBe(255); // JPG no tiene transparencia
      expect(rgba.r).toBeGreaterThan(200); // Debería ser muy rojo
      expect(rgba.g).toBeLessThan(100);     // Debería tener poco verde
      expect(rgba.b).toBeLessThan(100);     // Debería tener poco azul
      });
      });
      });