# Plan: SoberLife — Refactor Producción Final

Cambios grandes que reescriben varios módulos. Sin datos precargados, todo persiste en localStorage, navegación tipo stack real.

## 1. Navegación tipo historial (stack global)

Crear `src/lib/nav-history.ts`:
- Store en memoria + `sessionStorage` con `pushToHistory(path)` y `popFromHistory()`.
- Hook `useNavHistory()` que escucha cambios de ruta vía `useRouterState` y hace push automático (omitiendo duplicados consecutivos).

Actualizar `src/components/back-button.tsx`:
- Por defecto llama `popFromHistory()` → `navigate({ to: prevPath })`. Fallback a `router.history.back()`.

Integrar el tracker en `__root.tsx` para que cada cambio de ruta se registre.

## 2. Persistencia multi-cuenta

Reescribir `src/lib/auth.ts`:
- `Profile = { id, email, name, avatar, code, createdAt }`.
- `soberlife.profiles.v2` → array de perfiles.
- `soberlife.activeProfile.v2` → id activo.
- API: `listProfiles()`, `getActiveProfile()`, `setActiveProfile(id)`, `addProfile()`, `removeProfile(id)`, `logoutActive()` (quita activo sin borrar perfiles).
- Datos por-perfil con prefijo: `sl:${profileId}:habits`, `sl:${profileId}:appointments`, `sl:${profileId}:enrollments`.

Actualizar `use-habits.ts` para leer/escribir bajo el perfil activo y re-suscribirse al cambio de perfil.

Crear `src/hooks/use-appointments.ts` y `src/hooks/use-enrollments.ts` análogos.

## 3. Estado inicial vacío

- Eliminar todos los mocks de hábitos/medallas precargados en `soberlife.ts`.
- Registro → fuerza paso a `/elige-adiccion` → al confirmar crea UN habit con `currentDays: 0`.
- Dashboard sin hábitos muestra CTA "Añade tu primera adicción".

Mantener mocks SOLO en datos no-personales: catálogo de adicciones, doctores, centros, eventos comunitarios (son catálogo, no datos de usuario).

## 4. Modo claro funcional

En `src/styles.css` añadir bloque `:root.light-mode { --background: ...; --foreground: ...; ... }` que sobreescriba TODOS los tokens semánticos (background, foreground, card, primary, muted, border, etc.) con tonos claros.

`src/lib/theme.ts`:
- `getTheme()`, `setTheme('dark'|'light')` → toggle clase `light-mode` en `document.documentElement`, persiste en localStorage.
- Aplicar en `__root.tsx` al montar.

Toggle real en `/configuracion`.

## 5. Casi caigo con TTS

Reescribir `/casi-caigo`:
- Al montar: `reproducirMensajeApoyo()` exactamente como el usuario lo especificó.
- UI: avatar "Dr. Alejandro Méndez" animado, ondas de audio (CSS), indicador "En llamada..." parpadeante.
- Botón "Finalizar llamada" → `synth.cancel()` + `popFromHistory()`.

## 6. Directorio médico — flujo 7 pasos

Nueva ruta `/medico/$id/agendar` (o stepper en `/agenda`):
- Wizard con pasos: Modalidad → Espacio → Fecha (Calendar shadcn) → Horarios (grilla con ocupados tachados) → Pago (4 métodos con íconos) → Divisa (5 banderas, conversión en vivo) → Confirmación.
- Tasas de cambio hardcoded para conversión: USD→RD$ 58.5, EUR 63, COP 0.014, MXN 3.2.
- Confirmar guarda cita en `use-appointments` y navega a `/comunidad?tab=inscripciones`.

## 7. Comunidad — tab "Mis inscripciones"

Reescribir `/comunidad` con Tabs:
- Tab 1 (default): "Mis inscripciones" — citas médicas + eventos suscritos, con cancelar.
- Tab 2: Amigos.
- Tab 3: Eventos (botón "Inscribirme" guarda en enrollments).

## 8. Enciclopedia — fichas únicas

Reemplazar `src/lib/addiction-overrides.ts` con contenido único por: Alcohol, Nicotina, Cocaína, Marihuana, Heroína, Videojuegos, Redes Sociales, Juegos de Azar, Pornografía, Cafeína, Comida compulsiva, Compras compulsivas, Trabajo compulsivo, Benzodiacepinas. Cada ficha: definición técnica, causas únicas, síntomas de abstinencia específicos, soluciones específicas.

## 9. Ajustes — multi-cuenta + accesibilidad

`/configuracion`:
- Sección "Cuentas": lista de perfiles, botón cambiar/eliminar/añadir, "Cerrar sesión" (solo perfil activo).
- "Vincular dispositivo": modal con QR (SVG placeholder), código 6 dígitos, timer 5 min.
- "Accesibilidad": cada toggle aplica efecto real:
  - Alto contraste → clase `high-contrast` en `<html>` con `filter: contrast(160%)` + override de colores.
  - Lector pantalla → listener global que en focusin/click dispara `speechSynthesis.speak(target.ariaLabel || target.textContent)`.
  - Rampas accesibles → toggle compartido con `/centros` vía localStorage + custom event.

## 10. Flujo de ingreso

`__root.tsx` AuthGate:
- Si hay perfil activo → permite rutas.
- Si no → redirige a `/welcome` (público).
- Registro guarda perfil → fuerza `/elige-adiccion` → crea hábito → `/`.

## Archivos a tocar

Nuevos:
- `src/lib/nav-history.ts`
- `src/lib/theme.ts`
- `src/lib/accessibility.ts`
- `src/lib/currency.ts`
- `src/hooks/use-appointments.ts`
- `src/hooks/use-enrollments.ts`
- `src/routes/medico.$id.agendar.tsx`

Reescribir:
- `src/lib/auth.ts` (multi-perfil)
- `src/lib/soberlife.ts` (quitar mocks)
- `src/lib/addiction-overrides.ts` (14 fichas únicas)
- `src/hooks/use-habits.ts` (por-perfil)
- `src/components/back-button.tsx` (popFromHistory)
- `src/routes/__root.tsx` (tracker + theme init + AuthGate)
- `src/routes/casi-caigo.tsx` (TTS)
- `src/routes/configuracion.tsx` (cuentas + accesibilidad real)
- `src/routes/comunidad.tsx` (tabs con inscripciones)
- `src/styles.css` (light-mode tokens)

Editar:
- `src/routes/elige-adiccion.tsx` (crea hábito al elegir)
- `src/routes/login.tsx` (usa nuevo auth)
- `src/routes/index.tsx` (empty state)

No toco: addictions.ts catálogo, community.ts (catálogo doctores/eventos), centros.ts, challenges.ts, friends.ts (mocks de catálogo OK), bottom-nav.tsx.
