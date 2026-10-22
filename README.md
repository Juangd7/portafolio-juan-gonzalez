# Portafolio Juan González — v4.0

## Estructura del proyecto

```
portfolio-site/
├── index.html              ← Página principal
├── proyectos/
│   ├── index.html          ← Listado de proyectos
│   └── adecco/
│       └── index.html      ← Caso de estudio Adecco (Magazine Flip)
├── sobre-mi/index.html
├── contacto/index.html
├── assets/
│   ├── css/
│   ├── js/
│   ├── fonts/
│   └── proyectos/
│       └── adecco/
│           ├── manifest.json          ← Catálogo de 55 piezas gráficas
│           ├── originals/             ← 55 imágenes originales (PNG/JPG alta resolución)
│           └── previews/              ← 55 WebP optimizados para galería 3D (max 512px)
├── _redirects              ← Reglas de enrutamiento Netlify
├── robots.txt
└── sitemap.xml
```

## Despliegue en Netlify

### Opción 1 — Arrastrar carpeta (más fácil)
1. Ir a [netlify.com/drop](https://netlify.com/drop)
2. Arrastrar la carpeta `portfolio-site/` al área indicada
3. Netlify despliega en segundos y genera una URL

### Opción 2 — CLI
```bash
npm install -g netlify-cli
netlify deploy --dir=portfolio-site --prod
```

### Opción 3 — Git
1. Subir `portfolio-site/` a un repositorio GitHub
2. En Netlify: New site → Import from Git → seleccionar el repo
3. Build command: (vacío) | Publish directory: `.`

## Galería Magazine Flip — Caso Adecco

La galería 3D usa **Three.js r128** con shaders GLSL personalizados.
- Arrastra horizontalmente para navegar por el corredor
- Clic en cualquier pieza para verla en alta resolución (lightbox)
- Fallback HTML accesible cuando WebGL no está disponible

### Requisitos técnicos
- Servidor HTTP (no funciona abriendo el HTML directamente como `file://`)
- Para pruebas locales: `npx serve portfolio-site` o `python3 -m http.server`

## Imágenes

- **55 piezas gráficas** de 12 campañas para Adecco Colombia
- Originales en `/assets/proyectos/adecco/originals/` (PNG/JPG, 259 MB)
- Previews WebP en `/assets/proyectos/adecco/previews/` (~2 MB)
- Catálogo completo en `manifest.json`

## Paleta de colores

| Token | Valor | Uso |
|-------|-------|-----|
| `--yellow` | `#FFED00` | Acento principal |
| `--black` | `#000000` | Fondos oscuros, nav |
| `--purple` | `#662483` | Acento secundario |
| `--white` | `#ffffff` | Texto sobre fondos oscuros |

## Tipografías

- **Poppins** Bold/Black — títulos y headings
- **Source Sans 3** — cuerpo de texto
- Ambas cargadas desde Google Fonts

---

Generado: Octubre 2026
