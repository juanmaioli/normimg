# 🤖 NormIMG 🧉

Una herramienta de línea de comandos y librería para normalizar imágenes a un formato cuadrado o rectangular, rellenando los bordes con una versión desenfocada de la misma imagen.

### 1. 📦 Instalación (CLI Global)

Para usar la herramienta de línea de comandos en cualquier parte de tu sistema, instálala de forma global:

```bash
npm install -g normimg
```

### 2. 🚀 Uso como Herramienta de Comandos (CLI)

Una vez instalado, puedes usar el comando `normimg` directamente en tu terminal (o `node app.js` si estás en el directorio del proyecto).

#### A. Procesar un Archivo Individual
```bash
normimg --input <ruta_al_archivo> [opciones]
```

#### B. Procesar un Directorio Completo
```bash
normimg --input <ruta_al_directorio> --output <directorio_de_salida> [opciones]
```

### 3. ⚙️ Opciones Disponibles

| Opción Larga      | Opción Corta | Descripción                                                                | Valor por Defecto                                  |
| ----------------- | ------------ | -------------------------------------------------------------------------- | -------------------------------------------------- |
| `--input`         | `-i`         | **(Requerido)** Ruta al **archivo** o **directorio** de entrada.             | N/A                                                |
| `--output`        | `-o`         | Ruta de salida. Si es un dir, el defecto es `./output`. Si es un archivo, se añade `_final`. | N/A                                                |
| `--size`          | `-s`         | El tamaño en píxeles para el lado de la imagen (formato cuadrado). Ignorado si se usan `-w` y `-H`. | `Original`                                         |
| `--width`         | `-w`         | El ancho final de la imagen en píxeles.                                    | `size` o `Original`                                |
| `--height`        | `-H`         | El alto final de la imagen en píxeles.                                     | `size` o `Original`                                |
| `--compression`   | `-c`         | La calidad de compresión JPG (0-100).                                      | `80`                                               |
| `--blur`          | `-b`         | El nivel de desenfoque para el fondo (0-100).                              | `40`                                               |
| `--white`         | `-W`         | Usa un fondo blanco sólido en lugar de desenfocado. Ignora dimensiones y usa el lado más largo para ser cuadrado. | `false` |
| `--convert`       | `-P`         | Solo convertir PNG a JPG (sin redimensionar ni normalizar).                | `false` |
| `--help`          | `-h`         | Muestra el menú de ayuda.                                                  | N/A                                                |

### 4. ✨ Ejemplos (CLI)

#### Ejemplo 1: Imagen Individual (Dimensiones Originales con Blur)
```bash
normimg --input ./img/img1.jpg --compression 100 --blur 50
```

#### Ejemplo 2: Forzar Tamaño Cuadrado (600x600)
```bash
normimg --input ./img/img1.jpg --size 600
```

#### Ejemplo 3: Imagen con Fondo Blanco (Basado en lado más largo)
```bash
normimg --input ./img/img1.jpg --white
```

#### Ejemplo 4: Convertir PNG a JPG (Sin normalizar)
```bash
normimg --input ./img/mifoto.png --convert
```

#### Ejemplo 5: De Cuadrada a Landscape (16:9)
```bash
normimg --input ./img/cuadrada.jpg --width 1920 --height 1080
```

#### Ejemplo 6: Procesar una Carpeta Completa (Solo Conversión PNG a JPG)
```bash
normimg --input ./img --output ./solo-jpg --convert
```

---

### 5. 📚 Uso como Librería

También puedes usar la función de normalización en tus propios proyectos de Node.js.

#### A. Instalación como Dependencia
```bash
npm install normimg
```

#### B. Ejemplo de Uso en tu Código
```javascript
const { normalizaFoto, normalizaFotoCuadradaFondoBlanco, convertirPngAJpg } = require('normimg');
const path = require('path');

async function procesar() {
  try {
    // Opción A: Fondo desenfocado (usa dimensiones originales por defecto si se pasan como null)
    await normalizaFoto('input.jpg', 'output_blur.jpg', 40, null, null, 90);

    // Opción B: Forzar tamaño específico
    await normalizaFoto('input.jpg', 'output_600.jpg', 40, 600, 600, 90);

    // Opción C: Fondo blanco cuadrado (lado más largo)
    await normalizaFotoCuadradaFondoBlanco('input.jpg', 'output_white.jpg', 90);

    // Opción D: Conversión simple PNG -> JPG
    await convertirPngAJpg('input.png', 'output.jpg', 85);
    
    console.log('Imágenes procesadas con éxito');
  } catch (error) {
    console.error('Ocurrió un error:', error.message);
  }
}

procesar();
```
