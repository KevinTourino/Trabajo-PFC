const crear = document.getElementById("crearusuario")
const cambiarNombre = document.getElementById("rename")
const deletes = document.getElementById("delete")

cargarUsuarios()
currenUser()
  
crear.addEventListener("click",function(){
    crearUsuario();
})

cambiarNombre.addEventListener("click",function(){
    renombrarUsuario();
})

deletes.addEventListener("click", function(){
    deleteName();
})

function crearUsuario() {
    const usuarioIntroducido = document.getElementById("nuevoUsuario");
    const nuevo = usuarioIntroducido.value;
    if (!nuevo) {
        alert("Introduce un nombre");
        return;
    }
    let usuarios = localStorage.getItem("usuarios");
    if (usuarios) {
        usuarios = JSON.parse(usuarios);
    } else {
        usuarios = [];
    }

    let yaExiste = false;

    usuarios.forEach(function(user) {
        if (user.nombre.toLowerCase() === nuevo.toLowerCase()) {
            yaExiste = true;
        }
    });

    if (yaExiste) {
        alert("¡Este usuario ya existe!");
        usuarioIntroducido.value = "";
        return;
    }

    usuarios.push({ nombre: nuevo });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("currentUser", nuevo);
    currenUser();
    alert("Usuario creado correctamente");
    usuarioIntroducido.value = "";
    cargarUsuarios();
}

function cargarUsuarios() {
    const datalist = document.getElementById("usuariosList");
    const lista = document.getElementById("listaUsuarios");

    datalist.innerHTML = '';
    lista.innerHTML = '';

    const usuarios = localStorage.getItem("usuarios");

    if (usuarios) {
        const usuariosArray = JSON.parse(usuarios);

        usuariosArray.forEach(function(usuario) {
            const opt = document.createElement("option");
            opt.value = usuario.nombre;
            datalist.appendChild(opt);

            const li = document.createElement("li");
            li.textContent = usuario.nombre;
            lista.appendChild(li);
        });
    }
}

function cambiarUsuario() {
    const seleccionado = document.getElementById("seleccionarUsuario").value;
    if (!seleccionado){
        return;
    }
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    let usuario = null;

    usuarios.forEach(function(u) {
        if (u.nombre.toLowerCase() === seleccionado.toLowerCase()) {
            usuario = u;
        }
    });

    if (usuario) {
        document.getElementById("nombreUsuario").textContent = usuario.nombre;
        localStorage.setItem("currentUser", usuario.nombre);
    }
}
function currenUser() {
    let usercurrent = localStorage.getItem("currentUser");
    if (!usercurrent) {
        document.getElementById("nombreUsuario").textContent = "(ninguno)";
    }
    else{
        document.getElementById("nombreUsuario").textContent = usercurrent;
        document.getElementById("seleccionarUsuario").value = usercurrent;
    }
}


function renombrarUsuario() {
    const currentName = localStorage.getItem("currentUser");
    if (!currentName) {
        alert("No hay un usuario seleccionado.");
        return;
    }

    const inputNuevoNombre = document.getElementById("seleccionarUsuario");
    const nuevo = inputNuevoNombre.value;

    if (currentName == nuevo){
        alert("Introduce un nuevo nombre");
        return;
    }

    let usuarios = localStorage.getItem("usuarios");
    if (usuarios) {
        usuarios = JSON.parse(usuarios);
    } else {
        usuarios = [];
    }

    let yaExiste = false;

    usuarios.forEach(function(user) {
        if (user.nombre.toLowerCase() === nuevo.toLowerCase()) {
            yaExiste = true;
        }
    });

    if (yaExiste) {
        alert("¡Este nombre ya está en uso!");
        return;
    }

    let encontrado = false;
    usuarios.forEach(function(user) {
        if (user.nombre.toLowerCase() === currentName.toLowerCase()) {
            user.nombre = nuevo;
            encontrado = true;
        }
    });

    if (!encontrado) {
        alert("Usuario actual no encontrado.");
        return;
    }

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("currentUser", nuevo);

    alert("Usuario renombrado correctamente");
    inputNuevoNombre.value = "";

    cargarUsuarios();
    currenUser();
}

function deleteName(){
    const currentName = localStorage.getItem("currentUser");
    if (!currentName) {
        alert("No hay un usuario seleccionado.");
        return;
    }
    let usuarios = localStorage.getItem("usuarios");
    if (usuarios) {
        usuarios = JSON.parse(usuarios);
    } else {
        usuarios = [];
    }
    let indexAEliminar = -1;
    usuarios.forEach(function(user, index) {
        if (user.nombre.toLowerCase() === currentName.toLowerCase()) {
            indexAEliminar = index;
        }
    });
    if (indexAEliminar !== -1) {
        usuarios.splice(indexAEliminar, 1);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        localStorage.removeItem("currentUser");

        document.getElementById("seleccionarUsuario").value = "";
        document.getElementById("nombreUsuario").textContent = "(ninguno)";

        alert("Usuario eliminado correctamente");
        cargarUsuarios();
    } else {
        alert("Usuario no encontrado.");
    }
}
