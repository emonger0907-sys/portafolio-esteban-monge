# Portafolio · Esteban Monge Rojas

Sitio estático (HTML, CSS y JavaScript, sin dependencias ni paso de compilación), en español e inglés.

## Estructura

```
index.html                 Página principal
casos/                     Un archivo por caso de estudio
assets/css/site.css        Estilos (colores y tipografía al inicio del archivo)
assets/js/site.js          Idioma, gráfico de control, ranking y pestañas
assets/img/                Foto, infografías (WebP), favicon e imagen para redes
assets/docs/               CV, papers e infografías descargables
assets/fonts/              Archivo (tipografía variable, autoalojada)
_headers                   Encabezados de seguridad y caché para Cloudflare Pages
404.html                   Página de error
```

## Cómo editar textos

Cada texto aparece dos veces, una por idioma:

```html
<span lang="es">Texto en español</span><span lang="en">English text</span>
```

Cambia ambos. El botón ES / EN muestra uno u otro.

## Cómo cambiar una imagen

Las imágenes están en `assets/img/` en dos tamaños (`nombre.webp` de 1536 px y `nombre-800.webp` para celulares).
Para reemplazar una, guarda la nueva con el mismo nombre en ambos tamaños.

| Archivo | Dónde aparece |
|---|---|
| `gestion-visual` | Sección Gestión visual |
| `ia-aplicada` | Sección IA |
| `reduccion-scrap` | Trayectoria (Sustaining) y caso de scrap |
| `npi-nueva-linea` | Trayectoria (NPI) |
| `sgl-box-ultima-milla` | Trayectoria (SGL Box) y caso SGL Box |

## Publicar con GitHub y Cloudflare Pages

1. Crea un repositorio en GitHub (p. ej. `portafolio`) y sube todo el contenido de esta carpeta a la raíz.
2. En Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** y elige el repositorio.
3. Configuración de build: *Framework preset* `None`, *Build command* vacío, *Build output directory* `/`.
4. Guarda y despliega. Quedará en `https://<nombre-del-proyecto>.pages.dev`.
5. Cada `git push` a `main` publica los cambios automáticamente.

Para probarlo en tu computadora: `python -m http.server` dentro de esta carpeta y abre `http://localhost:8000`.
