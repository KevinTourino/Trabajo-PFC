let db;

/*OPEN DB*/
const request = indexedDB.open('UsersDB', 1);

        request.onupgradeneeded = function(event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains('users')) {
                db.createObjectStore('users', { keyPath: 'user' });
            }
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            console.log('Base de datos abierta');
        };

        request.onerror = function(event) {
            console.error('Error al abrir la base de datos', event.target.errorCode);
        };


/*CALL FUCTION createdUser*/
const created = document.getElementById("createdUser")
created.addEventListener("click",function(){
    createdUser();
})

/*REGISTER USER*/
function createdUser(){
  const name = document.getElementById("User").value;
  if (name==""){
    alert('El nombre no puede estar vacío.');
    return;
  }
  const password = document.getElementById("password").value;
  const transaction = db.transaction(['users'], 'readwrite');
  const store = transaction.objectStore('users');
  try {
    const user = {
      "user": name,
      "password": password,
    };

    const requestAdd = store.add(user);

    requestAdd.onsuccess = function() {
      alert('Usuario agregado');
      
      document.getElementById("User").value = "";
      document.getElementById("password").value = "";

      localStorage.setItem('CurrentUser', name);

      window.location.href = '/index.html';
    };

    requestAdd.onerror = function(event) {
      alert('Error al agregar usuario (probablemente ya existe)');
      console.error(event.target.error);
    };
  } catch (e) {
    console.error('Error al añadir:', e);
  }
}







// Obtener todos los usuarios
function getUsuarios() {
  return new Promise(async (resolve, reject) => {
    await openDB();
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const usuarios = [];

    const cursorRequest = store.openCursor();
    cursorRequest.onerror = () => reject("Error leyendo usuarios");
    cursorRequest.onsuccess = e => {
      const cursor = e.target.result;
      if (cursor) {
        usuarios.push(cursor.value);
        cursor.continue();
      } else {
        resolve(usuarios);
      }
    };
  });
}

// Agregar usuario
function addUsuario(usuario) {
  return new Promise(async (resolve, reject) => {
    await openDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const addRequest = store.add(usuario);
    addRequest.onerror = () => reject("Usuario ya existe");
    addRequest.onsuccess = () => resolve();
  });
}

// Actualizar usuario (renombrar)
function updateUsuario(oldNombre, nuevoNombre) {
  return new Promise(async (resolve, reject) => {
    await openDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    // Primero borrar el antiguo y luego agregar nuevo con nombre cambiado
    const deleteRequest = store.delete(oldNombre);
    deleteRequest.onerror = () => reject("Error al borrar usuario antiguo");
    deleteRequest.onsuccess = () => {
      const addRequest = store.add({ nombre: nuevoNombre });
      addRequest.onerror = () => reject("Nombre nuevo ya existe");
      addRequest.onsuccess = () => resolve();
    };
  });
}

// Eliminar usuario
function deleteUsuario(nombre) {
  return new Promise(async (resolve, reject) => {
    await openDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const deleteRequest = store.delete(nombre);
    deleteRequest.onerror = () => reject("Error eliminando usuario");
    deleteRequest.onsuccess = () => resolve();
  });
}

// Comprobar si usuario existe
function existeUsuario(nombre) {
  return new Promise(async (resolve) => {
    await openDB();
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const getRequest = store.get(nombre);
    getRequest.onsuccess = () => resolve(!!getRequest.result);
    getRequest.onerror = () => resolve(false);
  });
}

// ELEMENTOS DOM
const crear = document.getElementById("crearusuario");
const cambiarNombre = document.getElementById("rename");
const deletes = document.getElementById("delete");

const inputSelectUser = document.getElementById("selectUser");
const datalistUsers = document.getElementById("userList");
const listaUsuarios = document.getElementById("listUsers");
const inputNuevoUsuario = document.getElementById("User");
const inputPassword = document.getElementById("password");

// Guardar currentUser en IndexedDB no es trivial, lo guardaremos en localStorage (por simplicidad)
function setCurrentUser(nombre) {
  localStorage.setItem("currentUser", nombre);
}
function getCurrentUser() {
  return localStorage.getItem("currentUser");
}
function removeCurrentUser() {
  localStorage.removeItem("currentUser");
}

// Inicializar
document.addEventListener("DOMContentLoaded", async () => {
  await cargarUsuarios();
  mostrarUsuarioActual();
});

// CREAR USUARIO (Register)
if (crear) {
  crear.addEventListener("click", async () => {
    const nuevo = inputNuevoUsuario.value.trim();
    if (!nuevo) {
      alert("Introduce un nombre");
      return;
    }

    const existe = await existeUsuario(nuevo);
    if (existe) {
      alert("¡Este usuario ya existe!");
      inputNuevoUsuario.value = "";
      return;
    }

    try {
      await addUsuario({ nombre: nuevo });
      setCurrentUser(nuevo);
      alert("Usuario creado correctamente");
      inputNuevoUsuario.value = "";
      await cargarUsuarios();
      mostrarUsuarioActual();
    } catch {
      alert("Error creando usuario");
    }
  });
}

// Cargar usuarios en UI
async function cargarUsuarios() {
  if (!datalistUsers || !listaUsuarios) return;

  datalistUsers.innerHTML = "";
  listaUsuarios.innerHTML = "";

  const usuarios = await getUsuarios();

  usuarios.forEach(user => {
    const opt = document.createElement("option");
    opt.value = user.nombre;
    datalistUsers.appendChild(opt);

    const li = document.createElement("li");
    li.textContent = user.nombre;
    listaUsuarios.appendChild(li);
  });
}

// Mostrar usuario actual en el input selectUser
function mostrarUsuarioActual() {
  const currentUser = getCurrentUser() || "(ninguno)";
  if (inputSelectUser) inputSelectUser.value = currentUser;
}

// Cambiar usuario actual al seleccionar (LoginUser)
async function LoginUser() {
  if (!inputSelectUser) return;

  const seleccionado = inputSelectUser.value.trim();
  if (!seleccionado) return;

  const existe = await existeUsuario(seleccionado);
  if (existe) {
    setCurrentUser(seleccionado);
    mostrarUsuarioActual();
  }
}

// RENOMBRAR USUARIO (Login)
if (cambiarNombre) {
  cambiarNombre.addEventListener("click", async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert("No hay un usuario seleccionado.");
      return;
    }

    const nuevoNombre = inputSelectUser.value.trim();
    if (!nuevoNombre || nuevoNombre.toLowerCase() === currentUser.toLowerCase()) {
      alert("Introduce un nuevo nombre diferente al actual.");
      return;
    }

    const existe = await existeUsuario(nuevoNombre);
    if (existe) {
      alert("¡Este nombre ya está en uso!");
      return;
    }

    try {
      await updateUsuario(currentUser, nuevoNombre);
      setCurrentUser(nuevoNombre);
      alert("Usuario renombrado correctamente");
      inputSelectUser.value = nuevoNombre;
      await cargarUsuarios();
      mostrarUsuarioActual();
    } catch {
      alert("Error renombrando usuario");
    }
  });
}

// ELIMINAR USUARIO (Login)
if (deletes) {
  deletes.addEventListener("click", async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert("No hay un usuario seleccionado.");
      return;
    }

    try {
      await deleteUsuario(currentUser);
      removeCurrentUser();
      inputSelectUser.value = "";
      alert("Usuario eliminado correctamente");
      await cargarUsuarios();
      mostrarUsuarioActual();
    } catch {
      alert("Error eliminando usuario");
    }
  });
}

// Hacer disponible LoginUser en global para onchange inline
window.LoginUser = LoginUser;