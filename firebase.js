// CONFIGURACIÓN DE FIREBASE

const firebaseConfig = {
    apiKey: "AIzaSyAkdcq0OjQLRCzalzmtZIXCiyKjVtunDAA",
    authDomain: "proyectobusesjg.firebaseapp.com",
    databaseURL: "https://proyectobusesjg-default-rtdb.firebaseio.com",
    projectId: "proyectobusesjg",
    storageBucket: "proyectobusesjg.firebasestorage.app",
    messagingSenderId: "508887414931",
    appId: "1:508887414931:web:358158117db4db0151b566"
};

// INICIAR FIREBASE

firebase.initializeApp(firebaseConfig);

// CONEXIÓN A LA BASE DE DATOS

const db = firebase.database();

console.log("Firebase conectado correctamente");