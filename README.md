# seti-todo

App de tareas construida con Ionic 8, Angular 20 y Cordova.

## Requisitos

- Node.js 18+
- Ionic CLI: `npm install -g @ionic/cli`
- Cordova: `npm install -g cordova`
- Android Studio (para Android)
- Xcode 15+ (para iOS, solo macOS)

## Instalación

```bash
git clone <repo>
cd seti-todo
npm install
```

## Correr en el browser

```bash
ionic serve
```

## Compilar para Android

```bash
ionic build
cordova build android
```

El APK queda en `platforms/android/app/build/outputs/apk/debug/app-debug.apk`.

Si falla por licencias del SDK:
```bash
yes | sdkmanager --licenses
```

## Compilar para iOS

```bash
ionic build
cordova build ios
```

Para abrir en Xcode:
```bash
open platforms/ios/App.xcworkspace
```

El IPA requiere una cuenta de Apple Developer activa. Desde Xcode: Product > Archive > Distribute App.

Nota: si el build falla con error de macCatalyst o deployment target, verificar que `config.xml` tenga `<preference name="deployment-target" value="13.0" />` dentro del bloque `<platform name="ios">`.

## Funcionalidades

- Agregar, completar y eliminar tareas
- Crear y editar categorías con color
- Asignar categoría a cada tarea y filtrar por ella
- Feature flag via Firebase Remote Config (`show_categories`) que muestra u oculta el módulo de categorías sin necesidad de publicar una nueva versión

## Arquitectura

El proyecto sigue una arquitectura limpia dividida en capas:

- `domain` — modelos, interfaces de repositorio y use cases. No depende de nada externo.
- `infrastructure` — implementaciones concretas de los repositorios usando Ionic Storage y Firebase.
- `presentation` — páginas y componentes de Ionic/Angular.
- `shared` — componentes reutilizables.

## Optimizaciones aplicadas

- `OnPush` en todos los componentes para reducir ciclos de change detection
- Virtual scroll con `@angular/cdk` para listas grandes
- Lazy loading de rutas con `loadComponent`
- Signals y `computed` de Angular en lugar de subscripciones manuales

## Preguntas de la prueba

**Principales desafíos**

El más complicado fue la compatibilidad entre Cordova y el SDK de iOS 26 beta, que requiere un deployment target mínimo de 13.0. Cordova regenera el proyecto en cada build sobreescribiendo los cambios manuales en Xcode, así que la solución fue actualizar directamente el `config.xml` y el `Package.swift` de cordova-ios-plugins para que el cambio sea persistente.

Otro punto fue la integración de Firebase con Angular standalone. `APP_INITIALIZER` está deprecado a partir de Angular 19 y el reemplazo es `provideAppInitializer`, que simplifica bastante el setup porque usa `inject()` directamente sin necesitar el array `deps`.

**Optimizaciones de rendimiento**

`OnPush` es lo que más impacto tiene en el día a día — Angular deja de revisar el componente en cada ciclo y solo lo hace cuando cambia un input o un signal emite. El virtual scroll es importante para listas con muchos elementos porque solo renderiza lo que está visible en pantalla. El lazy loading ya venía configurado por defecto con `loadComponent` en las rutas.

**Calidad y mantenibilidad**

La separación por capas permite cambiar la implementación de storage (por ejemplo migrar a Firestore) sin tocar los use cases ni la presentación. Cada componente es standalone y declara sus propias dependencias, lo que hace más fácil entender qué usa cada uno sin tener que rastrear módulos. El gitflow con una branch por feature también ayuda a que el historial de git cuente la historia del desarrollo.
