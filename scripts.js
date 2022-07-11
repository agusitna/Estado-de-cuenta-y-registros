//Variables
let login = "/Users/awisniak/Documents/Andar/Requerimientos/Facturacion/login.html";
let index = "/Users/awisniak/Documents/Andar/Requerimientos/Facturacion/home.html";
let saldoActual = 0;
let f = new Date();
let fechaActual = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());
let contador = 1;
let contadorTotal = 0;
let contadorPendientes = 0;
let contadorRealizadas = 0;
let contadorSesion = 0;

function imprimirAviso(id, mensaje){
    let aviso = document.createElement("div");
                aviso.className= "alert alert-danger";
                aviso.id= id;
                aviso.textContent= mensaje;
                document.getElementById("sesion").appendChild(aviso);
   // document.getElementById(id).setAttribute("style", "max-width: 360px;")
}
function borrarAviso(id){
    if (document.getElementById(id)){
        document.getElementById(id).remove();
    }
}

function deshabilitarElemento(id){
    document.getElementById(id).setAttribute("disabled", "");
}

function cambiarValorDelElemento(id, valor){
    document.getElementById(id).value = valor;
}
//Funciones de sesión y redirección 
function iniciarSesion(){
    let usuario= document.getElementById("usuario").value;
    let clave= document.getElementById("clave").value;
        if(usuario == "test" && clave == "1234"){
            redireccion(index);
        }else if(usuario == '' && clave == ''){
            imprimirAviso("avisoDatos", "Debe completar todos los datos");
        }else{
            borrarAviso("avisoDatos");
            borrarAviso("avisoDenegado");
            contadorSesion++;
            imprimirAviso("avisoDenegado", "El usuario y/o contraseñas no son correctos");
            cambiarValorDelElemento("usuario", null);
            cambiarValorDelElemento("clave", null);
                if(contadorSesion == 2){
                    document.getElementById("avisoDenegado").textContent= "El usuario y/o contraseñas no son correctos. Tiene un intento restante"
                } 
                if(contadorSesion == 3){
                    borrarAviso("avisoDenegado")
                    imprimirAviso("avisoBloqueado", "Acceso bloqueado");
                    cambiarValorDelElemento("usuario", null);
                    cambiarValorDelElemento("clave", null);
                    deshabilitarElemento("usuario");
                    deshabilitarElemento("clave");
                    deshabilitarElemento("entrar");
            }   
        }   
}
function cerrarSesion(){
    usuario = undefined;
    clave = undefined;
    redireccion(login);
}

function redireccion(link){
    window.location.assign(link);
}


//Funciones de estado de cuenta

function registrarMovimiento(color, fecha, valor1, valor2){
    let fila="<tr><td>" + fecha + "</td><td style='color: "+ color+" ;'>" + valor1 + "</td><td>" + valor2 + "</td></tr>";  
    let crearTabla = document.createElement("TR");
    crearTabla.innerHTML=fila;
    document.getElementById("tabla-cuentas").appendChild(crearTabla);
    saldoADepositar = cambiarValorDelElemento("saldo-ingresado", null); //document.getElementById("saldo-ingresado").value = null;   
}

function depositar(){
//Depositar saldo
    let saldoADepositar = document.getElementById("saldo-ingresado").value;
        if(saldoADepositar == 0){
            alert("Debe ingresar un valor mayor a 0");
        }else{
            let saldoFinal = parseFloat(saldoActual) + parseFloat(saldoADepositar); 
            saldoActual = saldoFinal;
            document.getElementById("saldo-actual").innerHTML= saldoFinal;
            //Registrar el movimiento
            registrarMovimiento("green", fechaActual,"$" + saldoADepositar,"$" + saldoFinal);
    }
}

function extraer(){
    let saldoARetirar = document.getElementById("saldo-ingresado").value;

        if (saldoARetirar == 0){
            alert("Debe ingresar un valor mayor a 0");

        }else if (saldoActual == 0 && saldoARetirar > 1000) {
            alert("El saldo disponible para retirar es de $1000");
            saldoARetirar = 1000;
            let saldoFinal = parseFloat(saldoActual) - parseFloat(saldoARetirar);
            saldoActual = saldoFinal;
            document.getElementById("saldo-actual").innerHTML= saldoFinal; 
            //Registrar el movimiento
            registrarMovimiento("red", fechaActual,"$" + saldoARetirar, "$" +saldoFinal);

        }else if(saldoActual == -1000){
            alert("No se pueden realizar más extracciones");

        }else if((saldoActual - saldoARetirar) <= -1001){
            alert("Su extracción supera el límite descubierto de $1000");

        }else{
            let saldoFinal = parseFloat(saldoActual) - parseFloat(saldoARetirar);
            saldoActual = saldoFinal;
            document.getElementById("saldo-actual").innerHTML= saldoFinal;
            //Registrar el movimiento
            registrarMovimiento("red", fechaActual,"$-" + saldoARetirar,"$" + saldoFinal);
            
        }
}

//Funciones para registro y control de tareas
function actualizarContadores(){
    document.getElementById("cont-total").innerHTML= contadorTotal;
    document.getElementById("cont-pendientes").innerHTML= contadorPendientes;
    document.getElementById("cont-realizadas").innerHTML= contadorRealizadas;
}

function agregarTarea(){
    let nuevaTarea = document.getElementById("tarea").value;
    if(nuevaTarea == ''){
        alert("Debe ingresar una tarea");
    }else{
        let columna1= document.createElement("td");
        let columna2= document.createElement("td");
        let columna3= document.createElement("td");
        let columna4= document.createElement("td");
        let columna3div = document.createElement("div");
        let columna3input = document.createElement("input");
        let columna4btn = document.createElement("button");;
        let columna4span = document.createElement("span");

        columna3div.className="form-check form-switch";
        columna3input.type= "checkbox";
        columna3input.onclick= marcarTarea;
        columna3input.className= "form-check-input";
        columna3input.id= "checkbox";
        columna4btn.onclick= borrar;
        columna4btn.id = "btn-borrar";
        columna4btn.style= "border: none; background-color: transparent;";
        columna4span.className="material-icons";
        columna4span.style="margin-left: 13px;";
        columna4span.innerHTML="delete";

        columna1.innerHTML= contador;
        columna2.innerHTML= nuevaTarea;
        columna3div.appendChild(columna3input)
        columna3.appendChild(columna3div);
        columna4btn.appendChild(columna4span);
        columna4.appendChild(columna4btn);

        let crearTabla = document.createElement("tr");

        crearTabla.appendChild(columna1);
        crearTabla.appendChild(columna2);
        crearTabla.appendChild(columna3);
        crearTabla.appendChild(columna4);

        crearTabla.id= contador;
        document.getElementById("tabla-tareas").appendChild(crearTabla);
        nuevaTarea = cambiarValorDelElemento("tarea", null); //document.getElementById("tarea").value = null;
        contador++;
        contadorPendientes++;
        contadorTotal++; 
        // document.getElementById("cont-total").innerHTML= contadorTotal;
        // document.getElementById("cont-pendientes").innerHTML= contadorPendientes;
        // document.getElementById("cont-realizadas").innerHTML= contadorRealizadas;
        actualizarContadores();
        }    
}

function marcarTarea(){
    let div = this.parentNode; 
    let td = div.parentNode;   
    let inpCheckbox= div.firstChild;
    let tdAlLado = td.nextSibling;
    let botonBorrar= tdAlLado.firstChild;
        if(inpCheckbox.checked){
            botonBorrar.setAttribute("disabled", "");
            contadorRealizadas++;
            contadorPendientes--;
            actualizarContadores();
            // document.getElementById("cont-realizadas").innerHTML= contadorRealizadas;
            // document.getElementById("cont-pendientes").innerHTML= contadorPendientes;
        }else{
            botonBorrar.removeAttribute("disabled", "");
            contadorPendientes++;
            contadorRealizadas--;
            actualizarContadores();
            // document.getElementById("cont-realizadas").innerHTML= contadorRealizadas;
            // document.getElementById("cont-pendientes").innerHTML= contadorPendientes;
        }
}


function borrar(){
    let td = this.parentNode;
    let tr = td.parentNode;
    
        // objeto previo this.previousSibling 
        // objeto siguiente this.nextSibling
        if(window.confirm("Desea borrar la tarea?")){
            tr.remove();
            contadorTotal--;
            contadorPendientes--;
            contador--;
            document.getElementById("cont-total").innerHTML= contadorTotal;
            document.getElementById("cont-pendientes").innerHTML= contadorPendientes;
        }
}

// }
// let checkbox = document.getElementById("checkbox");
// checkbox.addEventListener("change", marcarTarea(), false);

// function marcarTarea(){
//     let checked = checkbox.checked;  
//        if (checked){
//             //deshabilitar eliminar
//             // contadorRealizadas++;
//             // contadorPendientes= contadorTotal -1;
//             alert("checkbox");
//         }
// }

    // function mostrarContador(contador){
    //     let contadorAMostrar = contador;
            
    //     document.getElementById("cont-total").appendChild(contadorAMostrar);
    // }

// function actualizarTablaContador(contador1, contador2, contador3){
//     // let  tablaContador = document.getElementById("tabla-contador");
//     let filaContador = "<tr><td>"+ contador1 + "</td><td>" + contador2 + "</td><td>" + contador3;
//     let crearTablaContador = document.createElement("TR");
//     crearTablaContador.innerHTML= filaContador;
//     document.getElementById("tabla-contador").appendChild(crearTablaContador);

//}
//Numeración de tareas
    // let btnTarea= document.getElementById("agregar-tarea");
    // let contadorTotal = 1;
    //     btnTarea.onclick = function() {
    //         contadorTotal++;
    //     }


