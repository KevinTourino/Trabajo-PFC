const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");
const drawer = document.getElementById("myDrawer");
const login = document.getElementById("login")

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
            showFilms();
        };

        request.onerror = function(event) {
            console.error('Error al abrir la base de datos', event.target.errorCode);
        };


const creartedFilm = document.getElementById("createdFilm");
const addLink = document.getElementById("addLink");
const deleteAll = document.getElementById("deleteAll");

creartedFilm.addEventListener("click", function(){
    createdfilms();
});

addLink.addEventListener("click",function(){
    putlinks();
})

deleteAll.addEventListener("click", function(){
    deletefilms();
});


    function deletefilms() {
        if (!confirm("¿Seguro que quieres eliminar tus películas?")) {
            return;
        }

        const currentUser = localStorage.getItem("CurrentUser");

        const transaction = db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        const request = store.get(currentUser);

        request.onsuccess = function (event) {
            const user = event.target.result;

            user.films = [];

            const updateRequest = store.put(user);

            updateRequest.onsuccess = function () {
                console.log(`Películas del usuario ${currentUser} eliminadas.`);
                showFilms();
            };

            updateRequest.onerror = function (e) {
                console.error("Error al guardar los cambios:", e.target.errorCode);
            };
        };

        request.onerror = function (event) {
            console.error("Error al acceder al usuario:", event.target.errorCode);
        };
    }


    async function createdfilms(){
            const currentUser = localStorage.getItem("CurrentUser")
            const tittle = document.getElementById("tittle");
            const description = document.getElementById("description");
            const container = document.getElementById("links-container")
            if (!tittle.value){
                alert("Introduce un título"); 
                return;
            }

            const details = await buscarEnOMDb(tittle.value);

            const links = [];
            const objects = document.querySelectorAll(".link-object");
            objects.forEach(obj => {
                const tittle = obj.querySelector(".tittle-link").value;
                const link = obj.querySelector(".link").value;
                const price = obj.querySelector(".price").value;
                if (tittle && link) {
                    links.push({ tittle, link, price });
                }
            });
            const transaction = db.transaction(['users'], "readwrite");
            const store = transaction.objectStore('users');
            const request = store.get(currentUser);

            request.onsuccess = function () {
                const user = request.result;
                console.log(user)

                if (!user.films) {
                    user.films = [];
                }

                newfilm = {
                    Tittle : tittle.value,
                    Description : description.value,
                    Links : links,
                    Details: details,
                };

                user.films.push(newfilm);

                const updateRequest = store.put(user);

                updateRequest.onsuccess = function () {
                    console.log("Película agregada con éxito");
                    showFilms();
                    tittle.value = "";
                    description.value = "";
                    container.innerHTML = "";
                };

                updateRequest.onerror = function (event) {
                    console.error("Error al guardar la película:", event.target.errorCode);
                };
            };

            request.onerror = function (event) {
                console.error("Error al obtener usuario:", event.target.errorCode);
            };
        
    }

    async function buscarEnOMDb(titulo) {
        try {
            const url = `https://www.omdbapi.com/?apikey=d614632d&t=${encodeURIComponent(titulo)}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.Response !== "False"){
                return data
            }
            else {
                return { Poster: "", Director: "", Actors: "", Genre: "", Plot: "" };
            }
        } catch (e) {
            console.log("Error al buscar en OMDb: ", e);
            return { Poster: "", Director: "", Actors: "", Genre: "", Plot: "" };
        }
    };


    function putlinks (){
        const container = document.getElementById("links-container");
        const div = document.createElement("div");
        div.classList.add("link-object");
        div.innerHTML = `
            <input class="tittle-link" placeholder="Título del sitio (Ej: Amazon)" />
            <input class="link" placeholder="URL del enlace" />
            <input class="price" placeholder="Precio (€)" />
            <button onclick="deletelink(this)">Eliminar</button>
        `;
        container.appendChild(div);
    }

    function deletelink(button){
        button.parentElement.remove();
    }


    function showFilms() {
        const currentUser = localStorage.getItem("CurrentUser");
        
        const transaction = db.transaction(['users'], 'readonly');
        const store = transaction.objectStore('users');
        const request = store.get(currentUser);

        request.onsuccess = function (event) {
            const user = event.target.result;

            if (!user.films) {
                console.log("No hay películas para este usuario");
                return;
            }

            const films = user.films;
            const cont = document.getElementById("list-films");
            cont.innerHTML = "";

            films.forEach((p, index) => {
                const div = document.createElement("div");
                div.className = "film";
                let posterHTML = "";
                if (p.Details?.Poster) {
                    posterHTML = `<img src="${p.Details.Poster}" alt="Poster" style="max-width:100px;" />`;
                }

                div.innerHTML = `
                    <input value="${p.Tittle}" onchange="editField(${index}, 'Tittle', this.value)" />
                    <textarea onchange="editField(${index}, 'Description', this.value)">${p.Description}</textarea>
            
                    <div class="details-films">
                        ${posterHTML}
                        <strong>Director:</strong> ${p.Details.Director || ""}<br>
                        <strong>Actores:</strong> ${p.Details.Actors || ""}<br>
                        <strong>Género:</strong> ${p.Details.Genre || ""}<br>
                        <strong>Sinopsis:</strong> ${p.Details.Plot || ""}<br>
                    </div>

                    <div class="links">
                        ${(p.Links || []).map((link, idx) => `
                            <div class="object-link">
                                <input class="tittle-link" value="${link.tittle}" onchange="editLink(${index}, ${idx}, 'tittle', this.value)" />
                                <input class="link" value="${link.link}" onchange="editLink(${index}, ${idx}, 'link', this.value)" />
                                <input class="price" value="${link.price}" onchange="editLink(${index}, ${idx}, 'price', this.value)" />
                                <button onclick="deleteLinkFilm(${index}, ${idx})">Eliminar</button>
                            </div>
                        `).join("")}
                        <button onclick="addlinkFilm(${index})">Agregar nuevo enlace</button>
                    </div>

                    <button id="position" onclick="deleteFilm(${index})" style="margin-top:10px;">Eliminar película</button>
                `;
                cont.appendChild(div);
            });
        };

        request.onerror = function (event) {
            console.error("Error al obtener el usuario:", event.target.errorCode);
        };
    }


    function deleteFilm(index) {
        let userConfirmed = confirm("¿Eliminar esta película?");
        if (!userConfirmed){
            return;
        } 
        const currentUser = localStorage.getItem("CurrentUser");
        const transaction = db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        const request = store.get(currentUser);

        request.onsuccess = function (event) {
            const user = event.target.result;

            if (!user.films || !user.films[index]) {
                console.warn("Película no encontrada");
                return;
            }

            user.films.splice(index, 1);

            const updateRequest = store.put(user);

            updateRequest.onsuccess = function () {
                console.log("Película eliminada correctamente");
                showFilms();
            };

            updateRequest.onerror = function (e) {
                console.error("Error al guardar cambios:", e.target.errorCode);
            };
        };
    }


    function addlinkFilm(indexFilm) {
        console.log("Entra")
        const currentUser = localStorage.getItem("CurrentUser");

        const transaction = db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        const request = store.get(currentUser);

        request.onsuccess = function (event) {
            const user = event.target.result;

            if (!user.films || !user.films[indexFilm]) {
                console.warn("Película no encontrada");
                return;
            }

            const film = user.films[indexFilm];
            if (!film.Links) {
                film.Links = [];
            }

            film.Links.push({ tittle: "", link: "", price: "" });

            const updateRequest = store.put(user);

            updateRequest.onsuccess = function () {
                console.log("Enlace agregado correctamente");
                showFilms(); // o mostrarProductos() si ese es tu renderizador
            };

            updateRequest.onerror = function (e) {
                console.error("Error al guardar los cambios:", e.target.errorCode);
            };
        };

        request.onerror = function (event) {
            console.error("Error al obtener el usuario:", event.target.errorCode);
        };
    }



    function editField(index, field, value) {
        const currentUser = localStorage.getItem("CurrentUser");

        const transaction = db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        const request = store.get(currentUser);

        request.onsuccess = function (event) {
            const user = event.target.result;

            if (!user.films || !user.films[index]) {
                console.warn("Película no encontrada");
                return;
            }

            const film = user.films[index];

            film[field] = value;

            const updateRequest = store.put(user);

            updateRequest.onsuccess = function () {
                console.log("Campo actualizado correctamente");
                showFilms();
            };

            updateRequest.onerror = function (e) {
                console.error("Error al guardar los cambios:", e.target.errorCode);
            };
        };

        request.onerror = function (event) {
            console.error("Error al obtener el usuario:", event.target.errorCode);
        };
    }



    function editLink(indexFilm, indexLink, field, value) {
        const currentUser = localStorage.getItem("CurrentUser");

        const transaction = db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        const request = store.get(currentUser);

        request.onsuccess = function (event) {
            const user = event.target.result;

            if (!user.films || !user.films[indexFilm]) {
                console.warn("Película no encontrada");
                return;
            }

            const film = user.films[indexFilm];
            const links = film.Links || [];

            if (!links[indexLink]) {
                console.warn("Enlace no encontrado");
                return;
            }

            links[indexLink][field] = value;

            const updateRequest = store.put(user);

            updateRequest.onsuccess = function () {
                console.log("Enlace actualizado correctamente");
                showFilms();
            };

            updateRequest.onerror = function (e) {
                console.error("Error al guardar los cambios:", e.target.errorCode);
            };
        };

        request.onerror = function (event) {
            console.error("Error al acceder al usuario:", event.target.errorCode);
        };
    }



function deleteLinkFilm(indexFilm, indexLink) {
    const currentUser = localStorage.getItem("CurrentUser");

    const transaction = db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.get(currentUser);

    request.onsuccess = function (event) {
        const user = event.target.result;

        if (!user.films || !user.films[indexFilm]) {
            console.warn("Película no encontrada");
            return;
        }

        const film = user.films[indexFilm];
        const links = film.Links || [];

        if (!links[indexLink]) {
            console.warn("Enlace no encontrado");
            return;
        }

        links.splice(indexLink, 1);

        const updateRequest = store.put(user);

        updateRequest.onsuccess = function () {
            console.log("Enlace eliminado correctamente");
            showFilms(); // o mostrarProductos()
        };

        updateRequest.onerror = function (e) {
            console.error("Error al guardar los cambios:", e.target.errorCode);
        };
    };

    request.onerror = function (event) {
        console.error("Error al acceder al usuario:", event.target.errorCode);
    };
}


if (localStorage.getItem("CurrentUser")==null)
    window.location.href = '/login/login.html';

closeBtn.addEventListener('click', function(){
    drawer.classList.remove('open')
});

openBtn.addEventListener('click', function(){
    drawer.classList.toggle('open');
});

login.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('CurrentUser');
    window.location.href = '/login/login.html';
});