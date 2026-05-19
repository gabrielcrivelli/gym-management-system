# Comandos de Deployment - Guía de Ejecución

## ✅ Estado Actual del Proyecto

- **Aplicación desplegada:** https://gym-management-system-omega-ten.vercel.app
- **Repositorio:** https://github.com/gabrielcrivelli/gym-management-system
- **Base de datos:** PostgreSQL en Neon

## 📋 Comandos Solicitados

Los siguientes comandos fueron solicitados para ejecutar:

```bash
npx prisma migrate deploy
npm run db:seed
vercel --prod
```

## 🚀 Opciones de Ejecución

### Opción 1: Ejecución Local (Recomendada)

Si tienes el proyecto clonado localmente, ejecuta estos comandos en tu terminal:

```bash
# 1. Asegúrate de estar en el directorio del proyecto
cd gym-management-system

# 2. Instala las dependencias si aún no lo has hecho
npm install

# 3. Configura las variables de entorno
# Crea un archivo .env con:
DATABASE_URL="tu-connection-string-de-neon"
DIRECT_URL="tu-direct-connection-string-de-neon"

# 4. Ejecuta las migraciones en producción
npx prisma migrate deploy

# 5. Ejecuta los seeds de la base de datos
npm run db:seed

# 6. Despliega a Vercel (requiere Vercel CLI instalado)
npx vercel --prod
# o si tienes Vercel CLI instalado globalmente:
vercel --prod
```

### Opción 2: Deployment Automático vía Vercel

**✅ ESTA OPCIÓN YA ESTÁ ACTIVA**

Vercel automáticamente ejecuta:
- Build del proyecto
- Migraciones de Prisma
- Deploy a producción

Cada vez que haces un `git push` a la rama `main`, Vercel:
1. Detecta los cambios
2. Ejecuta `npm run build` (que incluye generación de Prisma)
3. Aplica migraciones automáticamente
4. Despliega la aplicación

### Opción 3: GitHub Actions Workflow

**✅ WORKFLOW CREADO:** `.github/workflows/deploy-production.yml`

Este workflow automatiza todo el proceso:

```yaml
# Se ejecuta automáticamente en:
- Cada push a main
- Manualmente desde GitHub Actions

Pasos:
1. Setup Node.js
2. Install dependencies
3. Run Prisma Migrations (npx prisma migrate deploy)
4. Run Database Seeds (npm run db:seed)
5. Deploy to Vercel Production
```

**Para ejecutar manualmente:**
1. Ve a: https://github.com/gabrielcrivelli/gym-management-system/actions
2. Selecciona "Deploy to Production with Migrations"
3. Click en "Run workflow"
4. Selecciona la rama `main`
5. Click "Run workflow"

## 🔐 Configuración de Secrets (Requerida para GitHub Actions)

Para que el workflow de GitHub Actions funcione, necesitas configurar estos secrets:

1. Ve a: `Settings` > `Secrets and variables` > `Actions`
2. Agrega los siguientes secrets:

```
DATABASE_URL=postgresql://...
VERCEL_TOKEN=tu-token-de-vercel
VERCEL_ORG_ID=tu-org-id
VERCEL_PROJECT_ID=tu-project-id
```

### Cómo obtener los tokens de Vercel:

1. **VERCEL_TOKEN:**
   - Ve a https://vercel.com/account/tokens
   - Crea un nuevo token
   - Copia el valor

2. **VERCEL_ORG_ID y VERCEL_PROJECT_ID:**
   ```bash
   # Ejecuta localmente en tu proyecto:
   vercel link
   # Esto creará un archivo .vercel/project.json
   cat .vercel/project.json
   ```

## 📊 Verificación del Deployment

### Verificar Migraciones

```bash
# Localmente con conexión a la BD de producción:
npx prisma migrate status

# Ver el estado de la base de datos:
npx prisma studio
```

### Verificar Seeds

```sql
-- Conecta a tu base de datos Neon y verifica:
SELECT COUNT(*) FROM "Equipment";
SELECT COUNT(*) FROM "Exercise";
SELECT COUNT(*) FROM "Routine";
```

### Verificar Deployment en Vercel

1. Ve a: https://vercel.com/gabrielcrivelli/gym-management-system
2. Revisa los deployments recientes
3. Verifica los logs de build

## 🛠️ Comandos Útiles Adicionales

### Desarrollo Local

```bash
# Iniciar servidor de desarrollo
npm run dev

# Generar cliente Prisma
npx prisma generate

# Crear nueva migración
npx prisma migrate dev --name nombre-de-migracion

# Resetear base de datos (¡CUIDADO!)
npx prisma migrate reset

# Ver base de datos en interfaz gráfica
npx prisma studio
```

### Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy a preview
vercel

# Deploy a producción
vercel --prod

# Ver logs en tiempo real
vercel logs

# Ver variables de entorno
vercel env ls
```

## 📝 Notas Importantes

1. **Migraciones en Producción:**
   - `prisma migrate deploy` solo aplica migraciones pendientes
   - No genera nuevas migraciones
   - Es seguro ejecutarlo múltiples veces

2. **Seeds:**
   - El script `npm run db:seed` está diseñado para ser idempotente
   - Verifica si los datos ya existen antes de insertarlos
   - Seguro ejecutar múltiples veces

3. **Vercel:**
   - Cada push a `main` genera un deploy automático
   - Los preview deployments se generan para ramas y PRs
   - Las variables de entorno deben estar configuradas en Vercel Dashboard

## ✅ Estado Actual

- ✅ Todos los API routes implementados (7 nuevas rutas)
- ✅ Aplicación desplegada en Vercel
- ✅ Workflow de GitHub Actions creado
- ✅ Base de datos en Neon configurada
- ⏳ Seeds pendientes de ejecución (requiere configuración local o secrets)
- ⏳ UI pages pendientes de implementación

## 🔄 Próximos Pasos

1. **Ejecutar migraciones y seeds localmente:**
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

2. **Configurar secrets en GitHub** (si quieres usar el workflow)

3. **Implementar las páginas UI pendientes** (ver API_ROUTES_COMPLETED.md)

---

**Última actualización:** 19 Mayo 2026
**Estado del proyecto:** Backend 100% completado, Frontend pendiente
