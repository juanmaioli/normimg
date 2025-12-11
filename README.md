# 🤖 NormIMG 🧉

Una herramienta de línea de comandos para normalizar imágenes a un formato cuadrado, rellenando los bordes con una versión desenfocada de la misma imagen.

### 1. 📦 Instalación

Para usar esta herramienta, primero clona el repositorio e instala las dependencias:

```bash
# Clona el repositorio (si aún no lo has hecho)
# git clone <URL_DEL_REPOSITORIO>
# cd NormIMG

# Instala las dependencias con pnpm
pnpm install
```

### 2. 🚀 Uso

La herramienta puede procesar tanto un **archivo individual** como un **directorio completo** de imágenes (modo lote).

#### A. Procesar un Archivo Individual
```bash
node app.js --input <ruta_al_archivo> [opciones]
```

#### B. Procesar un Directorio Completo
```bash
node app.js --input <ruta_al_directorio> --output <directorio_de_salida> [opciones]
```

### 3. ⚙️ Opciones Disponibles

| Opción Larga      | Opción Corta | Descripción                                                                | Valor por Defecto                                  |
| ----------------- | ------------ | -------------------------------------------------------------------------- | -------------------------------------------------- |
| `--input`         | `-i`         | **(Requerido)** Ruta al **archivo** o **directorio** de entrada.             | N/A                                                |
| `--output`        | `-o`         | Ruta de salida. Si es un dir, el defecto es `./output`. Si es un archivo, se añade `_final`. | N/A                                                |
| `--size`          | `-s`         | El tamaño en píxeles para el lado de la imagen.                            | `1000`                                             |
| `--compression`   | `-c`         | La calidad de compresión JPG (0-100).                                      | `80`                                               |
| `--blur`          | `-b`         | El nivel de desenfoque para el fondo (0-100).                              | `40`                                               |
| `--help`          | `-h`         | Muestra el menú de ayuda.                                                  | N/A                                                |

### 4. ✨ Ejemplos

#### Ejemplo 1: Imagen Individual (Horizontal)
```bash
node app.js --input ./img/img1.jpg --size 600 --compression 100 --blur 50
```

**Original:**
![alt text](img/img1.jpg)

**Resultado:**
![alt text](img/img1_final.jpg)

---

#### Ejemplo 2: Imagen Individual (Vertical)
```bash
node app.js --input ./img/img2.jpg --size 800 --compression 100 --blur 20
```

**Original:**
![alt text](img/img2.jpg)

**Resultado:**
![alt text](img/img2_final.jpg)

---

#### Ejemplo 3: Procesar una Carpeta Completa
Este comando tomará todas las imágenes de la carpeta `img`, las procesará a un tamaño de 500px y las guardará en una nueva carpeta llamada `imagenes-procesadas`.

```bash
node app.js --input ./img --output ./imagenes-procesadas --size 500
```