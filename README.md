# RWM — Retro With Meni

**v1.3**

A real-time collaborative retrospective tool for agile teams. Create a session, invite your team via a shared link, and run structured retrospectives together — live, in the browser.

---

## Features

- **Real-time collaboration** — cards, votes, and phase changes sync instantly across all participants via WebSockets
- **Multiple retro formats** — choose the structure that fits your team
- **Facilitator mode** — one person drives the session through phases
- **Anonymous card writing** — cards are hidden from others during the write phase, revealed all at once
- **Dot voting** — each participant gets a fixed number of votes to prioritize topics
- **Discussion mode** — facilitator spotlights cards one at a time for focused discussion
- **Synchronized countdown timer** — shared timer visible to all participants
- **Dark mode** — toggle between light and dark theme
- **Spanish / English UI** — switch language at any time from the bottom-right corner
- **View previous sessions** — look up any past session by ID in read-only mode
- **Export** — download session results as JSON (available to facilitator in Discuss and Done phases)
- **Docker-ready** — single container with embedded SQLite database

---

## Retrospective Formats

Default format is **Went Well / Improve / Actions**. Default votes per person is **5**.

| Format | Columns |
|--------|---------|
| **Went Well / Improve / Actions** | 👍 Went Well · 🔧 Improve · 📋 Actions |
| **Start / Stop / Continue** | 🚀 Start · 🛑 Stop · ✅ Continue |
| **4Ls** | ❤️ Liked · 📚 Learned · ⚠️ Lacked · 🌟 Longed For |
| **Mad / Sad / Glad** | 😡 Mad · 😢 Sad · 😊 Glad |

---

## Session Phases

```
✍️ Write  →  🗳️ Vote  →  💬 Discuss  →  ✅ Done
```

1. **Write** — participants add cards anonymously; other people's cards are hidden
2. **Vote** — all cards are revealed; each participant votes on what matters most
3. **Discuss** — facilitator spotlights cards one by one for the team to talk through
4. **Done** — session complete; facilitator can export results

---

## Running with Docker

### 1. Build and start

```bash
docker compose up --build
```

The app will be available at **http://localhost:8100**

### Other useful commands

```bash
# Run in background
docker compose up --build -d

# View logs
docker compose logs -f

# Stop
docker compose down

# Stop and remove the database
docker compose down -v
```

> To change the external port, edit the `ports` mapping in `docker-compose.yml` (default: `8100:3000`).

---

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

App runs at **http://localhost:3000** in development.

No environment variables are required to run locally. The SQLite database is created automatically at `data/retro.db`.

> **Note for Windows users:** The dev server uses Webpack (not Turbopack) to avoid a Windows junction point issue with native modules. This is already configured in `server.js`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Real-time | Socket.io |
| Database | SQLite (better-sqlite3) |
| Styling | Tailwind CSS |
| i18n | Built-in (English / Spanish) |
| Runtime | Node.js 20 |
| Container | Docker |

---

## Project Structure

```
app/
├── page.tsx                    # Login — enter display name and email
├── layout.tsx                  # Root layout with LanguageProvider
├── home/page.tsx               # Home — create or look up a session
├── api/
│   ├── sessions/               # Session CRUD
│   └── sessions/[id]/export/   # JSON export
└── session/[sessionId]/
    ├── page.tsx                # Live retro board
    └── view/page.tsx           # Read-only session viewer

components/
├── board/                      # RetroBoard, Column, Card, VoteButton, CardForm
├── session/                    # PhaseControls, CountdownTimer, ParticipantList,
│                               # CreateSessionForm, LookupSessionForm, SessionList
├── providers/                  # SocketProvider, LanguageProvider
├── ThemeToggle.tsx             # Dark/light mode toggle
└── LanguageToggle.tsx          # EN/ES language switch

lib/
├── db.js                       # SQLite connection
├── db-queries.js               # Database helpers
├── retro-formats.js            # Column definitions per format
└── i18n/
    ├── en.json                 # English translations
    └── es.json                 # Spanish translations

socket/
└── handlers.js                 # Socket.io event handlers

server.js                       # Custom Node.js server (Next.js + Socket.io)
```

---

## License

MIT

---
---

# RWM — Retro With Meni *(Español)*

**v1.3**

Una herramienta de retrospectiva colaborativa en tiempo real para equipos ágiles. Crea una sesión, invita a tu equipo mediante un enlace compartido y lleven a cabo retrospectivas estructuradas juntos — en vivo, desde el navegador.

---

## Funcionalidades

- **Colaboración en tiempo real** — tarjetas, votos y cambios de fase se sincronizan al instante entre todos los participantes mediante WebSockets
- **Múltiples formatos de retro** — elige la estructura que mejor se adapte a tu equipo
- **Modo facilitador** — una persona guía la sesión a través de las fases
- **Escritura anónima de tarjetas** — las tarjetas están ocultas para los demás durante la fase de escritura y se revelan todas a la vez
- **Votación por puntos** — cada participante recibe un número fijo de votos para priorizar temas
- **Modo de discusión** — el facilitador destaca las tarjetas de una en una para una discusión enfocada
- **Temporizador de cuenta regresiva sincronizado** — temporizador compartido visible para todos los participantes
- **Modo oscuro** — alterna entre tema claro y oscuro
- **Interfaz en español / inglés** — cambia el idioma en cualquier momento desde la esquina inferior derecha
- **Ver sesiones anteriores** — consulta cualquier sesión pasada por ID en modo de solo lectura
- **Exportar** — descarga los resultados de la sesión en formato JSON (disponible para el facilitador en las fases Discutir y Listo)
- **Listo para Docker** — contenedor único con base de datos SQLite integrada

---

## Formatos de Retrospectiva

El formato predeterminado es **Qué salió Bien / Cosas a Mejorar / Acciones**. Votos por persona predeterminados: **5**.

| Formato | Columnas |
|---------|---------|
| **Qué salió Bien / Cosas a Mejorar / Acciones** | 👍 Qué salió Bien · 🔧 Cosas a Mejorar · 📋 Acciones |
| **Iniciar / Detener / Continuar** | 🚀 Iniciar · 🛑 Detener · ✅ Continuar |
| **4Ls** | ❤️ Gustó · 📚 Aprendí · ⚠️ Faltó · 🌟 Anhelé |
| **Enfadado / Triste / Feliz** | 😡 Enfadado · 😢 Triste · 😊 Feliz |

---

## Fases de la Sesión

```
✍️ Escribir  →  🗳️ Votar  →  💬 Discutir  →  ✅ Listo
```

1. **Escribir** — los participantes agregan tarjetas de forma anónima; las tarjetas de otros están ocultas
2. **Votar** — todas las tarjetas se revelan; cada participante vota lo que más importa
3. **Discutir** — el facilitador destaca las tarjetas una por una para que el equipo las analice
4. **Listo** — sesión completada; el facilitador puede exportar los resultados

---

## Ejecutar con Docker

### 1. Construir e iniciar

```bash
docker compose up --build
```

La aplicación estará disponible en **http://localhost:8100**

### Otros comandos útiles

```bash
# Ejecutar en segundo plano
docker compose up --build -d

# Ver logs
docker compose logs -f

# Detener
docker compose down

# Detener y eliminar la base de datos
docker compose down -v
```

> Para cambiar el puerto externo, edita el mapeo de `ports` en `docker-compose.yml` (por defecto: `8100:3000`).

---

## Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La app se ejecuta en **http://localhost:3000** en modo desarrollo.

No se requieren variables de entorno para ejecutar localmente. La base de datos SQLite se crea automáticamente en `data/retro.db`.

> **Nota para usuarios de Windows:** El servidor de desarrollo usa Webpack (no Turbopack) para evitar un problema con puntos de unión en Windows con módulos nativos. Esto ya está configurado en `server.js`.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript |
| Tiempo real | Socket.io |
| Base de datos | SQLite (better-sqlite3) |
| Estilos | Tailwind CSS |
| i18n | Integrado (Inglés / Español) |
| Runtime | Node.js 20 |
| Contenedor | Docker |

---

## Estructura del Proyecto

```
app/
├── page.tsx                    # Login — introduce nombre y correo electrónico
├── layout.tsx                  # Layout raíz con LanguageProvider
├── home/page.tsx               # Inicio — crear o buscar una sesión
├── api/
│   ├── sessions/               # CRUD de sesiones
│   └── sessions/[id]/export/   # Exportación JSON
└── session/[sessionId]/
    ├── page.tsx                # Tablero de retro en vivo
    └── view/page.tsx           # Vista de sesión de solo lectura

components/
├── board/                      # RetroBoard, Column, Card, VoteButton, CardForm
├── session/                    # PhaseControls, CountdownTimer, ParticipantList,
│                               # CreateSessionForm, LookupSessionForm, SessionList
├── providers/                  # SocketProvider, LanguageProvider
├── ThemeToggle.tsx             # Alternador de modo oscuro/claro
└── LanguageToggle.tsx          # Selector de idioma EN/ES

lib/
├── db.js                       # Conexión SQLite
├── db-queries.js               # Helpers de base de datos
├── retro-formats.js            # Definición de columnas por formato
└── i18n/
    ├── en.json                 # Traducciones en inglés
    └── es.json                 # Traducciones en español

socket/
└── handlers.js                 # Manejadores de eventos Socket.io

server.js                       # Servidor Node.js personalizado (Next.js + Socket.io)
```

---

## Licencia

MIT
