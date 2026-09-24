# La Joya — código y guía de publicación V1

Exportación del 24 de septiembre de 2026, basada en la versión publicada 8, commit f704b9e86c2d09f4bc10a676c9965abb0b90709b. Incluye logo animado La Joya, crédito RP con logo y enlace, tarifas, nuevo orden de secciones, sin franja superior de horarios, título de clases destacado, reservas por WhatsApp, ondas y buzo con burbujas.

Esta copia separa los estilos y extrae las fotografías del HTML sin cambiar sus bytes. No modifica el sitio que ya está publicado. No contiene credenciales ni la configuración interna de Sites. El número comercial visible NO es una contraseña.

## 1. Abrir y ejecutar

1. Descomprimí el ZIP completo. Conservá las carpetas.
2. En Visual Studio Code elegí Archivo > Abrir carpeta y seleccioná La_Joya_V1, donde está este LEEME.
3. Usá una extensión de servidor local de tu confianza, o Python si ya lo tenés instalado.
4. Con Python, abrí una terminal en La_Joya_V1 y ejecutá:

```powershell
py -m http.server 5500 --bind 127.0.0.1 --directory public
```

En macOS/Linux, sustituí `py` por `python3`. Visitá http://localhost:5500. Detené el servidor con Ctrl+C. No necesitás npm, compilar ni instalar librerías para ejecutar este proyecto.

Podés abrir index.html directamente para una revisión básica, pero localhost es más adecuado para comprobar el portapapeles y el comportamiento del navegador.

## 2. Dónde modificar cada cosa

| Archivo | Qué modifica |
| --- | --- |
| public/index.html | Textos, tarifas, horarios, estructura, formulario, enlaces y marcas SVG de La Joya |
| public/estilos.css | Diseño general, colores, tipografías, tamaños, distribución y reglas para celular |
| public/logo.css | Apariencia y animación del logo La Joya |
| public/interactions.js | Mensaje de WhatsApp, validaciones, menú, ondas y buzo |
| public/assets/ | Fotos, imagen del buzo y logo RP |

Para encontrar algo, usá Ctrl+Shift+F y buscá una frase visible, un selector como `.hero` o una variable como `WHATSAPP_NUMBER`.

El CSS contiene reglas que se fueron ajustando durante el diseño. Ante varias reglas del mismo selector, importan la especificidad, las condiciones @media y su orden. Revisá las reglas posteriores antes de concluir que un cambio no funciona. Los colores del logo están también en logo.css.

Las tres fotografías se llaman la-joya-jardin.jpeg, la-joya-piscinas.jpeg y la-joya-carriles.jpeg. Son las capturas proporcionadas, no fotografías originales recortadas; el encuadre lo hace CSS con background-size y background-position. Al reemplazarlas por originales, revisá ese encuadre. El logo RP procede del kit suministrado. El buzo es un recurso generado para este proyecto.

## 3. Guardar en GitHub

Creá un repositorio privado vacío llamado, por ejemplo, balneario-la-joya. No agregués README desde GitHub si vas a seguir estos comandos en el proyecto local.

Instalá Git y usá la autenticación del navegador, un gestor de credenciales o GitHub Desktop; no pongás contraseñas ni tokens en archivos.

Desde la carpeta La_Joya_V1:

```bash
git init
git add .
git commit -m "Version inicial La Joya"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/balneario-la-joya.git
git push -u origin main
git tag v1.0.0
git push origin v1.0.0
```

Sustituí TU_USUARIO por tu usuario real. Si Git solicita nombre/correo, configurá tu identidad de autor antes del commit. GitHub Desktop es una alternativa gráfica a estos comandos.

## 4. Publicar en Cloudflare Pages

1. Entrá en tu cuenta de Cloudflare.
2. Abrí Workers & Pages > Create application > Pages.
3. Elegí importar un repositorio Git y conectá GitHub, autorizando únicamente el repositorio necesario.
4. Seleccioná balneario-la-joya.
5. Usá esta configuración para ESTE paquete:

| Campo | Valor |
| --- | --- |
| Production branch | main |
| Framework preset | None |
| Build command | exit 0 |
| Build output directory | public |
| Root directory | Vacío: raíz del repositorio |

6. Publicá y esperá el resultado satisfactorio.
7. Abrí la dirección *.pages.dev entregada por Cloudflare y revisá la página.

Solo se publica public; este LEEME no queda como una página pública. GitHub puede ser privado y el sitio público. Cambiar una copia local no publica nada hasta subir el cambio a la rama configurada.

## 5. Dominio propio

Registrá el dominio deseado, verificando disponibilidad y renovación. Dejá dominio y alojamiento bajo control del negocio y activá verificación en dos pasos.

En el proyecto Pages, abrí Custom domains y asociá el dominio. Seguí sus instrucciones DNS. Para el dominio raíz, Cloudflare Pages requiere que la zona use sus servidores DNS; un subdominio puede enlazarse mediante CNAME según la configuración. No borrés registros de correo existentes al migrar DNS. Esperá a que el dominio y HTTPS figuren activos.

Conservá el sitio actual disponible hasta comprobar el nuevo. Elegí una sola copia principal para los cambios futuros: esta exportación y Sites no se sincronizan automáticamente.

## 6. Modificar sin romper producción

```bash
git switch main
git pull --ff-only
git switch -c cambio-horarios
```

Editá, probá en localhost y guardá:

```bash
git add .
git commit -m "Actualizar horarios"
git push -u origin cambio-horarios
```

Abrí un pull request a main. Revisá la URL de preview de Cloudflare y después integrá el cambio. main actualiza producción automáticamente cuando la integración está configurada. Para un problema, podés restaurar un despliegue anterior en Cloudflare y revertir el commit en Git; mantené ambas versiones alineadas.

Si un archivo CSS o JS parece viejo, recargá sin caché (Ctrl+F5) y, al publicar cambios, aumentá su parámetro de versión en index.html, por ejemplo `interactions.js?v=8`. Es una ayuda de caché, no una protección de seguridad.

## 7. Cómo funciona WhatsApp

Todo ocurre en el navegador. No hay envío automático, API, token, sesión de WhatsApp en la web ni guardado de solicitudes en una base de datos.

1. El visitante llena nombre, fecha, personas, actividad, paquete opcional y comentarios.
2. `submit` intercepta el envío del formulario con `preventDefault()`.
3. `FormData(form)` obtiene los datos.
4. Se comprueban restricciones y se arma un mensaje con una plantilla de JavaScript.
5. `textContent` muestra el mensaje como texto, sin interpretar HTML del visitante.
6. Se construye el enlace con destino fijo:

```js
const WHATSAPP_NUMBER = '50663656047';
const url = 'https://wa.me/' + WHATSAPP_NUMBER
  + '?text=' + encodeURIComponent(message);
```

El número lleva país y número, sin +, espacios o guiones. `encodeURIComponent` adapta espacios, saltos de línea, tildes y símbolos para que puedan viajar en una URL. NO cifra ni oculta la información. Evitá datos sensibles en el mensaje.

7. El botón recibe la URL, `target='_blank'` y `rel='noopener noreferrer'`.
8. El visitante abre WhatsApp y decide enviar. El equipo del balneario confirma disponibilidad y reserva por separado.

Para cambiar el mensaje, buscá `const message=` en interactions.js. Ejemplo simplificado, distinto de la plantilla completa incluida:

```js
const message = `¡Hola! Soy ${name}.
Quisiera consultar una visita el ${d.get('fecha')}.
Cantidad de personas: ${d.get('personas')}.
¿Hay disponibilidad?`;
```

Para agregar un campo: creá un input/select con `name` en index.html, obtenelo con `d.get('nombreDelCampo')`, validalo y añadilo al mensaje. Recordá que los valores de data-plan en los enlaces deben coincidir con las opciones del selector.

Al editar el formulario se oculta la revisión y se elimina el href anterior: así no se continúa con datos desactualizados. El botón Copiar usa el portapapeles; si falla, selecciona el mensaje para copiar manualmente.

## 8. Validaciones actuales y siguientes

Incluidas: nombre obligatorio y no vacío tras trim, fecha obligatoria desde hoy, personas entre 1 y 500, límites de longitud de nombre y comentarios, y bloqueo de 16 sesiones con profesor. El máximo de 500 es un límite técnico existente del formulario, NO una afirmación de capacidad del balneario. Ajustalo con la administración.

Por mejorar según reglas reales: mostrar paquetes solo para natación, limpiar paquetes al cambiar a otra actividad, impedir combinaciones no aplicables, manejar horarios por disciplina y diferenciar disponibilidad real de una consulta. No se calcula un cobro ni se descuenta cupo.

Las validaciones de navegador mejoran la experiencia, pero pueden saltarse. Cuando agregués CRM, servidor, pagos o almacenamiento, verificá de nuevo datos y permisos en el servidor. Nunca pongás contraseñas, claves de CRM o tokens de API en public.

## 9. Qué aprender

- HTML: etiquetas, formularios, atributos name/id y accesibilidad.
- CSS: selectores, cascada, Flexbox, Grid y @media.
- JavaScript: variables, funciones, eventos, DOM, FormData, validación y URL.
- Git: commit, branch, pull request, merge, revert y tags.
- Publicación: dominio, DNS, HTTPS, preview y producción.
- Para el futuro CRM: HTTP/API, autenticación, autorización, base de datos y copias de seguridad.

## 10. Comprobación antes de cada publicación

- Textos/precios/horarios correctos en móvil y escritorio.
- Menú abre y cierra por botón, enlace, clic exterior y Escape.
- Mensaje WhatsApp llega al número correcto y contiene todos los datos. Abrir el enlace no envía automáticamente.
- Nombre vacío, fecha pasada, cantidad inválida y paquete incompatible se rechazan.
- Cambiar un dato obliga a revisar de nuevo.
- Fotos, logos, enlaces RP y ubicación cargan.
- Ondas y buzo funcionan con mouse/táctil; movimiento reducido del sistema se respeta.
- Consola del navegador sin errores y recursos locales sin 404.

La exportación fue comprobada en estructura, rutas, sintaxis JS y equivalencia de los archivos extraídos. No representa una auditoría de seguridad ni una prueba visual completa en todos los navegadores.

## Documentación oficial consultada

- HTML estático: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
- Git y previews: https://developers.cloudflare.com/pages/configuration/git-integration/
- Dominios: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Restaurar publicación: https://developers.cloudflare.com/pages/configuration/rollbacks/
- WhatsApp click to chat: https://faq.whatsapp.com/5913398998672934
