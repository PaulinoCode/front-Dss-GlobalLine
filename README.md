# 📊 Global Line Solutions - Frontend del Sistema de Soporte a la Decisión (DSS)

Este proyecto contiene la Single-Page Application (SPA) desarrollada con **Angular** para el Sistema de Soporte a la Decisión de Global Line. Proporciona la interfaz de usuario para la gestión de ventas, análisis de métricas y la visualización de análisis predictivos.

---

## 🚀 Características Principales

### 🔐 Seguridad y Acceso
* **Autenticación Segura:** Login contra un endpoint de backend que valida credenciales encriptadas.
* **Control de Roles (RBAC):**
  * **ADMIN:** Acceso total al sistema, incluyendo la gestión de usuarios.
  * **MANAGER:** Acceso a módulos operativos como clientes, productos y análisis.
* **Protección de Rutas:** `CanActivate` guards para proteger las rutas según el rol del usuario.
* **Manejo de Tokens:** Interceptor HTTP para adjuntar automáticamente tokens de autenticación a las peticiones.

### 📈 Inteligencia de Negocios
* **Dashboard Interactivo:** Visualización de KPIs, tendencias de ventas, rentabilidad y rankings de clientes y productos.
* **Gráficas Dinámicas:** Implementadas con **Chart.js** y **ng2-charts** para una visualización de datos clara y efectiva.
* **Análisis de Riesgo (Montecarlo):** Interfaz para ejecutar y visualizar simulaciones de Montecarlo realizadas por el backend.

### 🛠️ Gestión Operativa
* **Módulos CRUD Completos:** Interfaces para la gestión de Clientes, Productos, Métricas y Usuarios.
* **Carga Masiva de Datos:** Funcionalidad para subir archivos **Excel** y realizar una carga masiva de métricas históricas.
* **Generación de Reportes:** Botones para solicitar y descargar reportes en **PDF** y respaldos en **Excel** generados por el backend.

---

## 🛠️ Stack Tecnológico y Arquitectura

### Backend (API REST)
Este frontend se conecta a un backend construido con:
* **Repositorio:** [**github.com/PaulinoCode/DssBackendGlobalLine**](https://github.com/PaulinoCode/DssBackendGlobalLine)
* **Lenguaje:** Java 25
* **Framework:** Spring Boot 4.0
* **Base de Datos:** PostgreSQL
* **Documentación API:** Swagger/OpenAPI 3.0

### Frontend (Esta Aplicación)
* **Framework:** Angular 17+ (con Componentes Standalone).
* **Diseño y Estilos:** Bootstrap 5 y SCSS.
* **Visualización de Datos:** Chart.js y la librería `ng2-charts`.
* **Arquitectura:**
  * **`src/app/core`**: Lógica central como `Guards` e `Interceptors`.
  * **`src/app/features`**: Módulos funcionales de la aplicación (ej. `dashboard`, `clients`).
  * **`src/app/models`**: Interfaces TypeScript para un tipado de datos estricto.
  * **`src/app/services`**: Servicios dedicados para la comunicación con la API.

---

## ⚙️ Instalación y Ejecución

### Prerrequisitos
* **Backend Corriendo:** El servidor del backend debe estar en ejecución.
* **Node.js:** v18 o superior.
* **Angular CLI:** v17 o superior.

### Pasos para la Ejecución
1.  **Clonar el Repositorio del Backend:**
    ```bash
    git clone https://github.com/PaulinoCode/DssBackendGlobalLine.git
    ```
    Sigue las instrucciones de su `README.md` para ejecutarlo. Por defecto, correrá en `http://localhost:8080`.

2.  **Clonar el Repositorio del Frontend (este proyecto):**
    ```bash
    git clone [URL-DE-ESTE-REPOSITORIO-FRONTEND]
    cd dss-front
    ```

3.  **Instalar Dependencias del Frontend:**
    ```bash
    npm install
    ```

4.  **Iniciar el Servidor de Desarrollo del Frontend:**
    ```bash
    ng serve
    ```

5.  **Acceder a la Aplicación:**
    Abre tu navegador y ve a `http://localhost:4200/`.

### 📖 Documentación de la API (Backend)
Para explorar y probar los 33 endpoints disponibles, la API del backend proporciona una interfaz de Swagger UI. Una vez que el servidor del backend esté corriendo, accede a:
[**http://localhost:8080/docs**](http://localhost:8080/docs)

---

## 🔑 Credenciales de Acceso

El sistema genera automáticamente usuarios base la primera vez que se ejecuta el backend:

| Rol | Usuario (Email) | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin@globalline.com` | `12345` |
| **Manager** | `manager@globalline.com` | `12345` |

---

## 💻 Guía de Comandos (Angular CLI)

Para mantener la consistencia en la estructura del proyecto, utiliza los siguientes comandos para generar nuevos elementos:

**Generar un Componente:**
```bash
# Ejemplo para un componente dentro de la feature "orders"
ng generate component features/orders/order-detail
```

**Generar un Servicio:**
```bash
ng generate service services/order
```
