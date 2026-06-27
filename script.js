// =========================
// CONTROL DE PANTALLAS
// =========================

function cambiarPantalla(idPantalla){

    let pantallas = document.querySelectorAll(".pantalla");

    pantallas.forEach(function(pantalla){
        pantalla.style.display = "none";
    });

    document.getElementById(idPantalla).style.display = "block";
}

// =========================
// INICIO DEL SISTEMA
// =========================

window.onload = function(){

    cambiarPantalla("pantalla-inicio");

}
// =========================
// MOSTRAR CONTRASEÑA
// =========================

function mostrarPassword(){

    let campo = document.getElementById("pass-chofer");

    if(campo.type === "password"){
        campo.type = "text";
    }else{
        campo.type = "password";
    }

}
// =========================
// LOGIN CHOFER
// =========================

function validarChofer(){

    let usuario = document.getElementById("user-chofer").value;
    let password = document.getElementById("pass-chofer").value;

    // Usuario de prueba
    if(usuario === "chofer123" && password === "pereira2026"){

        alert("✅ Bienvenido conductor");

        cambiarPantalla("pantalla-form-chofer");

    }else{

        alert("❌ Usuario o contraseña incorrectos");

    }

}
// =========================
// CONTROL DE RUTA
// =========================

var rutaActiva = false;

var placaActual = "";

function alternarRuta(){
	
	let empresa =
	document.getElementById("c-empresa").value;
	let nombre =
	document.getElementById("c-nombre").value;
	let placa =
	document.getElementById("c-placa").value;
	placaActual = placa;
	let ruta =
	document.getElementById("c-ruta").value;
	
	if(nombre == "" || placa == "" || ruta == ""){
		alert("Completa todos los datos.");
		return;
		
	}

    let frenos = document.getElementById("chk-frenos");
    let aceite = document.getElementById("chk-aceite");
    let llantas = document.getElementById("chk-llantas");

    let boton = document.getElementById("btnRuta");

    // SI LA RUTA NO ESTÁ ACTIVA
    if(!rutaActiva){

        if(!frenos.checked){
            alert("Debes revisar los frenos.");
            return;
        }

        if(!aceite.checked){
            alert("Debes revisar el aceite.");
            return;
        }

        if(!llantas.checked){
            alert("Debes revisar las llantas.");
            return;
        }

        rutaActiva = true;
		
		db.ref("rutas/" + placa).set({
			
			empresa: empresa,
			conductor: nombre,
			placa: placa,
			ruta: ruta,
			activa: true,
			fecha: new Date().toLocaleString()
			
		});
			
		
        boton.innerHTML = "🔴 TERMINAR RUTA";
        boton.style.background = "#cc0000";

        alert("🟢 Ruta iniciada correctamente.");
		iniciarSeguimientoGPS();

    }

    // SI LA RUTA YA ESTÁ ACTIVA
    else{

        let confirmar = confirm(
            "¿Estás seguro de finalizar la ruta?"
        );

        if(confirmar){

            rutaActiva = false;
			
			// Cambiar estado en Firebase
			db.ref("rutas/" + placaActual).update({
				
				activa: false,
				fachaFin: new Date().toLocaleString()
				
			});
			
			// Cambiar boton
            boton.innerHTML = "🟢 INICIAR RUTA";
            boton.style.background = "#00aa44";

            alert("🔴 Ruta finalizada.");

        }

    }

}

// =========================
// GPS CONTINUO
// =========================

var idGPS = null;

function iniciarSeguimientoGPS(){

    if(!navigator.geolocation){

        alert("GPS no soportado.");

        return;
    }

    idGPS = setInterval(function(){

        navigator.geolocation.watchPosition(

            function(posicion){
				
			db.ref("rutas/" + placaActual).update({
				
				latitud: posicion.coords.latitude,
				longitud: posicion.coords.longitude
				
			});

            },

            function(error){

                console.log(
                    "Error GPS:",
                    error.message
                );

            }

        );

    }, 1000);

}

function detenerSeguimientoGPS(){

    if(idGPS !== null){

        clearInterval(idGPS);

        idGPS = null;

        console.log("GPS detenido");

    }

}

// =========================
// MAPA LEAFLET
// =========================

var mapa = null;
var marcador = null;

function iniciarMapa(){

    if(mapa !== null){
        return;
    }

    mapa = L.map('mapa').setView(
        [4.8133, -75.6961],
        13
    );

    L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    {
        attribution: '&copy; OpenStreetMap & CartoDB'
    }
    ).addTo(mapa);

    marcador = L.marker(
        [4.80, -75.70]
    ).addTo(mapa);

    marcador.bindPopup(
        "Bus en camino" 
    ).openPopup();

}
function abrirMapa(placaSeleccionada){
    
	placaActual = placaSeleccionada;
	
    cambiarPantalla("pantalla-mapa");

    document.getElementById(
        "titulo-mapa-ruta"
    ).innerHTML = placaSeleccionada;

    setTimeout(function(){

        iniciarMapa();

        mapa.invalidateSize();
		
		db.ref("rutas/" + placaSeleccionada).on("value",
		function(snapshot){
			
			let datos = snapshot.val();
			
			marcador.setLatLng([
			    datos.latitud,
				datos.longitud
			]);
			
			mapa.setView(
			    [datos.latitud, datos.longitud],
				16
				
			);
			
		});

    },300);

}
00
// =====================================
// Mostrar automáticamente las rutas
// que los choferes tengan activas.
// Datos obtenidos desde Firebase.
// =====================================

function cargarRutas(empresa){

    cambiarPantalla("pantalla-rutas");

    document.getElementById("titulo-rutas").innerHTML =
        "Rutas Disponibles - " + empresa;

    let contenedor =
        document.getElementById("contenedor-rutas-botones");

    contenedor.innerHTML = "";

    db.ref("rutas").once("value", function(snapshot){

        snapshot.forEach(function(hijo){

            let datos = hijo.val();

            if(datos.activa == true){

                let boton = document.createElement("button");

                boton.className = "btn-ruta";

                boton.innerHTML =
                    datos.ruta +
                    "<br>" +
                    datos.conductor +
                    " - " +
                    datos.placa;

                boton.onclick = function(){

                    abrirMapa(datos.placa);
					
				};
					

                contenedor.appendChild(boton);

            }

        });

    });

}
