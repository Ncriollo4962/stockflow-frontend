# Stockflow Frontend

Sistema de gestión de inventarios construido con Angular.

## Características Implementadas

- **Autenticación Completa**:
  - Inicio de sesión (Login) y Registro de usuarios.
  - Gestión de Tokens (JWT) con interceptores para adjuntar token automáticamente.
  - Renovación de tokens (Refresh Token).
  - Validaciones de formularios reactivos.
  - Layout dedicado para autenticación.

- **Configuración de Entornos**:
  - **Local**: Para desarrollo en máquina local con backend local.
  - **Development**: Para entorno de desarrollo en servidor remoto.
  - **Production**: Para despliegue en producción.

- **Proxy y Configuración de Red**:
  - Proxy configurado (`proxy.conf.json`) para evitar problemas de CORS en desarrollo local.
  - Puerto por defecto configurado a **4500**.

## Requisitos Previos

- Node.js
- pnpm (Gestor de paquetes utilizado)
- Angular CLI

## Instalación

1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   pnpm install
   ```

## Ejecución del Proyecto

### Entorno Local (Recomendado para desarrollo)

Este comando levanta la aplicación en el puerto **4500** y utiliza el proxy para redirigir las peticiones al backend local (`localhost:8080`).

```bash
ng serve
# O explícitamente:
ng serve --configuration=local
```

Accede a la aplicación en: `http://localhost:4500/`

### Entorno de Desarrollo (Dev)

Conecta con el backend de desarrollo en `api-cluster.stockflow.pe`.

```bash
ng serve --configuration=development
```

### Entorno de Producción

Simula la configuración de producción.

```bash
ng serve --configuration=production
```

## Estructura del Proyecto

- `src/app/core`: Servicios singleton, interceptores y guardias (AuthService, AuthInterceptor).
- `src/app/auth`: Módulo de autenticación (Login, Register, AuthLayout).
- `src/environments`: Archivos de configuración de entorno (`.local.ts`, `.dev.ts`, `.prod.ts`).
- `proxy.conf.json`: Configuración del proxy para desarrollo local.

## Build

Para generar los archivos de distribución para producción:

```bash
ng build --configuration=production
```

Los archivos se generarán en la carpeta `dist/stockflow-frontend`.
