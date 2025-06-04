const user = document.getElementById("user")
user.textContent="User: "+localStorage.getItem("CurrentUser")

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

const change = document.getElementById("change")

change.addEventListener("click", function(){
  const ppassword = document.getElementById("ppassword").value;
  const npassword = document.getElementById("npassword").value;
  const transaction = db.transaction(['users'], "readwrite");
  const store = transaction.objectStore('users');
  const request = store.get(localStorage.getItem("CurrentUser"));

  request.onsuccess = function () {
    const usuario = request.result;
        if (usuario.password === ppassword) {
            usuario.password = npassword;

            const updateRequest = store.put(usuario);

            updateRequest.onsuccess = function () {
                alert("Contraseña actualizada con éxito.");
                document.getElementById("ppassword").value = "";
                document.getElementById("npassword").value = "";
            };

            updateRequest.onerror = function () {
                alert("Error al actualizar la contraseña.");
            };
        } else {
            alert("Contraseña incorrecta.");
        }
    };
});


if (localStorage.getItem("CurrentUser")==null)
    window.location.href = '../login/login.html';

const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");
const drawer = document.getElementById("myDrawer");
const login =document.getElementById("login")

closeBtn.addEventListener('click', function(){
    drawer.classList.remove('open')
});

openBtn.addEventListener('click', function(){
    drawer.classList.toggle('open');
});

login.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('CurrentUser');
    window.location.href = '../login/login.html';
});


const deleted = document.getElementById("delete");
deleted.addEventListener("click", function(){
    const confirmDelete = confirm("¿Estás seguro de que quieres eliminar esto?");
    if (!confirmDelete) {
        return;
    }
    const transaction = db.transaction(['users'], "readwrite");
    const store = transaction.objectStore('users');
    const request = store.get(localStorage.getItem("CurrentUser"));
    request.onsuccess = function () {
        const user =  request.result;

        const deleteRequest = store.delete(localStorage.getItem("CurrentUser"));

        deleteRequest.onsuccess = function () {
            alert("Usuario eliminado exitosamente.");
            localStorage.removeItem("CurrentUser");
            window.location.href = "../login/login.html";
        };

        deleteRequest.onerror = function () {
            alert("Error al eliminar al usuario.");
        };
    };

})