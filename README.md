# VibeGallery — Production & Development Docker Architecture

VibeGallery is an interactive design museum built using **React, Vite, and React Router**. This repository contains a production-ready containerization layer designed for fast, seamless local development and secure, highly optimized production delivery.

---

## 🏛️ Prerequisites

Ensure you have the following installed on your system:
- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **Make** (utility command runner)

---

## 🚀 Getting Started

The environment can be fully managed using simple `make` commands.

### 1. Development Mode
To boot up the interactive development server with hot-reloading (HMR):
```bash
make dev
```
* Vite will automatically boot on [http://localhost:5173](http://localhost:5173).
* Local file changes will hot-reload instantly in the browser.
* If `.env` doesn't exist, it will automatically clone `.env.example` to boot.

### 2. Production Mode
To build, compile, and run the optimized production container served by an unprivileged Nginx instance:
```bash
make prod
```
* The site will run detached on [http://localhost:8080](http://localhost:8080).
* Serving assets has been locked down to non-root users (`nginx` UID/GID 101).

---

## 🛠️ Makefile Commands

| Command | Description |
| :--- | :--- |
| `make help` | Displays explanations of all available targets. |
| `make dev` | Starts the full development environment on port `5173`. |
| `make prod` | Compiles code and starts the production container on port `8080`. |
| `make build` | Builds both developer and production Docker images. |
| `make rebuild` | Builds all Docker images from scratch without using cache. |
| `make up` | Boots development containers in detached background mode. |
| `make down` | Shuts down active container networks. |
| `make restart` | Restarts all active containers. |
| `make logs` | Watches developer environment container log streams. |
| `make logs-app` | Focuses logs exclusively on the application container. |
| `make shell` | Enters a shell inside the active development container. |
| `make exec CMD="..."`| Executes custom commands inside the running container. |
| `make clean` | Stops containers and deletes volumes and caches. |
| `make prune` | Safely clears unused container layers and networks. |
| `make reset` | Fully resets everything (images, volumes, networks, and caches). |
| `make test` | Executes the test suite. |
| `make lint` | Audits files for linting issues using ESLint. |
| `make format` | Formats files (autofixing ESLint problems). |
| `make health` | Checks statuses and health flags for active environments. |
| `make ps` | Lists active container instances. |
| `make stats` | Evaluates active container CPU/Memory consumption. |

---

## 📋 Environment Variables

Copy `.env.example` to `.env` to override configuration defaults:
* `NODE_ENV`: Toggle between `development` and `production`.
* `PORT`: Set the exposed port (Default is `5173`).
* `VITE_API_URL`: Frontend integration endpoint.

---

## 📂 Project Structure

```
.
├── assets/                  # Original static assets (logos, pictures)
├── public/                  # Public assets copied for Vite bundling
│   └── assets/              # Static files served under /assets
├── src/                     # React application sources
│   ├── components/          # Reusable modules (Lightbox, Canvas, etc.)
│   ├── data/                # Shared layout database
│   ├── pages/               # Page view configurations (Home, Gallery)
│   ├── App.jsx              # Routing configurations
│   └── main.jsx             # React entry point
├── Dockerfile.dev           # Hot-reloading development image definition
├── Dockerfile.prod          # Multi-stage production Nginx image definition
├── docker-compose.dev.yml   # Volume-mounted development dev-server
├── docker-compose.prod.yml  # Resource-limited production server
├── nginx.conf               # SPA routing fallback nginx configuration
├── Makefile                 # Automation command shortcuts
└── README.md                # System documentation
```

---

## 🛡️ Production & Security Best Practices

Our production container (`Dockerfile.prod` & `docker-compose.prod.yml`) enforces the following guidelines:
1. **Unprivileged User**: Standard Nginx containers run as root. We utilize `nginxinc/nginx-unprivileged` to restrict executions to UID `101`, preventing host privilege escalation.
2. **Resource Allocation Caps**: Limits the container to a maximum of `0.5` cores (50% CPU) and `512MB` memory to mitigate denial-of-service impacts.
3. **Dedicated Bridge Networks**: Isolates dev and prod traffic inside separate custom Docker networks (`vibegallery-dev-net` and `vibegallery-prod-net`).
4. **Health Checks**: Automated health validation tests run `wget` queries internally to confirm the web server is responsive.
5. **No New Privileges**: Prevents processes from acquiring extra privileges via `setuid` or `setgid` binaries.

---

## 🔧 Troubleshooting

### Port Conflicts
If you receive `port already in use` error:
- Dev is binded to `5173`, Prod to `8080`.
- Verify if other services are occupying these ports by running:
  ```bash
  docker ps
  # or
  make down
  ```

### Hot Reloading Issues (WSL/Windows)
If file modifications are not hot-reloading inside the container when developing on WSL/Windows host volumes:
- Add a polling configuration to `vite.config.js` if file-system notify alerts are blocked:
  ```js
  server: {
    watch: {
      usePolling: true
    }
  }
  ```
