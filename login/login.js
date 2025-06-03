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
            getUsers();
        };

        request.onerror = function(event) {
            console.error('Error al abrir la base de datos', event.target.errorCode);
        };

/*HTTP REGISTER*/        
const register = document.getElementById("register")
register.addEventListener("click",function(){
    window.location.href = '/register/register.html';
})

/*CALL FUCTION getUser()*/
const login = document.getElementById("login")
login.addEventListener("click",function(){
    getUser();
})


/*CHECK USER*/
function getUser(){
  const user = document.getElementById("selectUser").value;
  const password = document.getElementById("password").value;
  if (user==""){
    alert("Debe introducir nombre de usuario.")
    return;
  }
  const transaction = db.transaction(['users'], "readonly");
  const store = transaction.objectStore('users');
  const request = store.get(user);

  request.onsuccess = function () {
    const usuario = request.result;
    console.log(usuario)
    if (usuario) {
        if (usuario.password === password) {
            localStorage.setItem('CurrentUser', user);
            document.getElementById("selectUser").value = "";
            document.getElementById("password").value = "";

            window.location.href = '/films/films.html'
        } 
        else {
            alert("Contraseña incorrecta.")
        }
    } 
    else {
        alert('Usuario no encontrado');
    }
  };
}

/*GET ALL USERS*/
function getUsers(){
    const datalist = document.getElementById("userList");
    const lista = document.getElementById("listUsers");
    const transaction = db.transaction(['users'], "readonly");
    const store = transaction.objectStore('users');
    const request = store.getAllKeys();

    request.onsuccess = function () {
        const allUsers = request.result;
        allUsers.forEach(function(users) {
            const opt = document.createElement("option");
            opt.value = users;
            datalist.appendChild(opt);

            const li = document.createElement("li");
            li.textContent = users;
            lista.appendChild(li);
        });

    console.log('Usuarios obtenidos:', allUsers);
    };

    request.onerror = function () {
    console.error('Error al obtener los usuarios');
    };
}