# Duelo multijugador: pasos para activarlo (una sola vez)

1. Entra a https://console.firebase.google.com y abre el proyecto **eduquest-20d0e**.
2. Menú **Build > Firestore Database > Create database**. Elige "Production mode" y la región que prefieras.
3. En la pestaña **Rules**, borra lo que haya, pega el contenido de `firestore.rules` y pulsa **Publish**.
4. (Opcional) En **Firestore > TTL**, crea una política sobre el campo `expira` de la colección `duelos` para que las salas viejas se borren solas.
5. Sube el proyecto de nuevo (build + deploy). Para probar necesitas 2 cuentas distintas (por ejemplo, una ventana normal y otra de incógnito).

Jugadores mínimos para empezar: 2 (cámbialo en `DUELO_MIN`, dentro de index.html). Tiempo por pregunta: `DUELO_SEG` (15 s).
