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
| `--size`          | `-s`         | El tamaño en píxeles para el lado de la imagen (formato cuadrado). Ignorado si se usan `-w` y `-H`. | `1000`                                             |
| `--width`         | `-w`         | El ancho final de la imagen en píxeles.                                    | `size`                                             |
| `--height`        | `-H`         | El alto final de la imagen en píxeles.                                     | `size`                                             |
| `--compression`   | `-c`         | La calidad de compresión JPG (0-100).                                      | `80`                                               |
| `--blur`          | `-b`         | El nivel de desenfoque para el fondo (0-100).                              | `40`                                               |
| `--help`          | `-h`         | Muestra el menú de ayuda.                                                  | N/A                                                |

### 4. ✨ Ejemplos (CLI)

#### Ejemplo 1: Imagen Individual (Cuadrada)
```bash
normimg --input ./img/img1.jpg --size 600 --compression 100 --blur 50
```

#### Ejemplo 2: De Cuadrada a Landscape (16:9)
```bash
normimg --input ./img/cuadrada.jpg --width 1920 --height 1080
```

#### Ejemplo 3: Procesar una Carpeta Completa
Este comando tomará todas las imágenes de `img/`, las procesará a 500px y las guardará en `imagenes-procesadas/`.
```bash
normimg --input ./img --output ./imagenes-procesadas --size 500
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
const { normalizaFoto } = require('normimg');
const path = require('path');

const imagenEntrada = path.join(__dirname, 'mi-foto.jpg');
const imagenSalida = path.join(__dirname, 'mi-foto-final.jpg');

async function procesar() {
  try {
    console.log('Normalizando imagen...');
    // Parámetros: input, output, blur, width, height, quality
    await normalizaFoto(imagenEntrada, imagenSalida, 40, 1920, 1080, 90);
    console.log(`Imagen guardada en ${imagenSalida}`);
  } catch (error) {
    console.error('Ocurrió un error:', error.message);
  }
}

procesar();
```
