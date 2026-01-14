# 🤖 NormIMG

Herramienta CLI para normalizar imágenes a formato cuadrado con relleno desenfocado.

## 1. 📋 Resumen del Proyecto

**NormIMG** es una aplicación de línea de comandos (CLI) desarrollada en Node.js que permite procesar imágenes individuales o directorios completos. Su función principal es redimensionar las imágenes a un formato cuadrado, rellenando los espacios vacíos con una versión desenfocada de la misma imagen original.

### 🛠 Tecnologías Clave
-   **Node.js**: Entorno de ejecución.
-   **Jimp**: Procesamiento y manipulación de imágenes.
-   **Yargs**: Manejo de argumentos de línea de comandos.
-   **Jest**: Framework de pruebas unitarias.

### 📂 Estructura Principal
-   `app.js`: Punto de entrada. Maneja la lógica de argumentos (CLI) y orquesta el procesamiento (individual o por lotes).
-   `imagenFunciones.js`: Contiene la lógica core de manipulación de imágenes (`normalizaFotoCuadrada`).
-   `img/`: Directorio de ejemplo con imágenes para pruebas.

## 2. 🚀 Construcción y Ejecución

### Instalación
El proyecto utiliza `pnpm` como gestor de paquetes principal (detectado `pnpm-lock.yaml`), aunque también existe un `package-lock.json`.

```bash
# Instalar dependencias
pnpm install
```

### Ejecución
La herramienta se ejecuta directamente con Node.js:

```bash
# Procesar un archivo individual
node app.js --input <ruta_archivo> [opciones]

# Procesar un directorio completo
node app.js --input <ruta_directorio> --output <ruta_salida> [opciones]
```

### Pruebas
Los tests unitarios se ejecutan con Jest:

```bash
pnpm test
```

## 3. 💻 Convenciones de Desarrollo

### Estilo de Código
-   **Idioma**: El código y los comentarios están en **español** (`imagenOriginal`, `tamanioLado`, etc.).
-   **Módulos**: Se utiliza **CommonJS** (`require`/`module.exports`).
-   **Asincronía**: Uso extensivo de `async/await`.
-   **Documentación**: Uso de JSDoc para documentar funciones y tipos de parámetros (ver `imagenFunciones.js`).
-   **Feedback Visual**: Los mensajes de consola incluyen emojis para mejorar la legibilidad (`🔍`, `🖼️`, `✅`).

### Flujo de Trabajo
1.  La lógica de negocio debe residir en archivos separados (ej. `imagenFunciones.js`), manteniendo `app.js` solo para la lógica de la CLI.
2.  Al añadir nuevas funcionalidades de procesamiento de imagen, actualizar los tests correspondientes en `imagenFunciones.test.js`.
