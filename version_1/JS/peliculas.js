    const crearProducto = document.getElementById("crearProducto");
    const agregarEnlace = document.getElementById("agregarEnlace");
    const eliminarTodas = document.getElementById("EliminarTodas");

    crearProducto.addEventListener("click", function(){
        crearEnLocal();
    });

    agregarEnlace.addEventListener("click",function(){
        ponerEnlace();
    })

    eliminarTodas.addEventListener("click", function(){
        borrarLista();
    });

    function borrarLista() {
         if (!confirm("¿Seguro que quieres eliminar tus peliculas?")){
            return;
        } 
        const peliculasGuardadas = JSON.parse(localStorage.getItem("peliculas")) || [];
        const currentUser = localStorage.getItem("currentUser")
        const nuevasPeliculas = [];
        peliculasGuardadas.forEach(pelicula => {
            if (pelicula.Usuario !== currentUser) {
                nuevasPeliculas.push(pelicula);
            }
        });
        localStorage.setItem("peliculas", JSON.stringify(nuevasPeliculas));
        mostrarProductos();
        console.log(`Películas del usuario ${currentUser} eliminadas.`);
    }


    function cambiarPeliculasDoom(){
        const currentUser = localStorage.getItem("currentUser");
        mostrarProductos();
    }
    async function crearEnLocal(){
        const currentUser = localStorage.getItem("currentUser")
        if (currentUser){
            const titulo = document.getElementById("titulo");
            const descripcion = document.getElementById("descripcion");
            const container = document.getElementById("enlaces-container")
            if (!titulo.value){
                alert("Introduce un título"); 
                return;
            }

            const detalles = await buscarEnOMDb(titulo.value);

            const enlaces = [];
            const items = document.querySelectorAll(".enlace-item");
            items.forEach(itm => {
                const titulo = itm.querySelector(".titulo-enlace").value;
                const enlace = itm.querySelector(".enlace").value;
                const precio = itm.querySelector(".precio").value;
                if (titulo && enlace) {
                    enlaces.push({ titulo, enlace, precio });
                }
            });

            let peliculas = localStorage.getItem("peliculas");
            if (peliculas) {
                peliculas = JSON.parse(peliculas);
            }
            else {
                peliculas = [];
            }
            nuevoProducto = {
                Titulo : titulo.value,
                Descripcion : descripcion.value,
                Enlaces : enlaces,
                Detalles : detalles,
                Usuario : currentUser
            }
            peliculas.push(nuevoProducto);
            localStorage.setItem("peliculas", JSON.stringify(peliculas));
            mostrarProductos();
            titulo.value = "";
            descripcion.value = "";
            container.innerHTML = ""
        }
        else{
            alert ("Primero seleccione o cree un usuario")
        }
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


    function ponerEnlace (){
        const container = document.getElementById("enlaces-container");
        const div = document.createElement("div");
        div.classList.add("enlace-item");
        div.innerHTML = `
            <input class="titulo-enlace" placeholder="Título del sitio (Ej: Amazon)" />
            <input class="enlace" placeholder="URL del enlace" />
            <input class="precio" placeholder="Precio (€)" />
            <button onclick="eliminarEnlace(this)">Eliminar</button>
        `;
        container.appendChild(div);
    }

    function eliminarEnlace(button){
        button.parentElement.remove();
    }


    function mostrarProductos() {
        let peliculas = localStorage.getItem("peliculas");
        if (peliculas) {
            peliculas = JSON.parse(peliculas);
        }
        else {
            peliculas = [];
        }
        const cont = document.getElementById("lista-productos");
        cont.innerHTML = "";

        const currentUser = localStorage.getItem("currentUser");

        peliculas.forEach((p, index) => {
            if (p.Usuario !== currentUser) return;

            const div = document.createElement("div");
            div.className = "producto";
            let posterHTML = "";
            if (p.Detalles?.Poster) {
                posterHTML = `<img src="${p.Detalles.Poster}" alt="Poster" style="max-width:100px;" />`;
            }

            div.innerHTML = `
                <input value="${p.Titulo}" onchange="editarCampo(${index}, 'Titulo', this.value)" />
                <textarea onchange="editarCampo(${index}, 'Descripcion', this.value)">${p.Descripcion}</textarea>
        
                <div class="detalles-pelicula">
                    ${posterHTML}
                    <strong>Director:</strong> ${p.Detalles.Director || ""}<br>
                    <strong>Actores:</strong> ${p.Detalles.Actors || ""}<br>
                    <strong>Género:</strong> ${p.Detalles.Genre || ""}<br>
                    <strong>Sinopsis:</strong> ${p.Detalles.Plot || ""}<br>
                </div>

                <div class="enlaces">
                    ${(p.Enlaces || []).map((enlace, idx) => `
                        <div class="item-enlace">
                            <input class="titulo-enlace" value="${enlace.titulo}" onchange="editarEnlace(${index}, ${idx}, 'titulo', this.value)" />
                            <input class="enlace" value="${enlace.enlace}" onchange="editarEnlace(${index}, ${idx}, 'enlace', this.value)" />
                            <input class="precio" value="${enlace.precio}" onchange="editarEnlace(${index}, ${idx}, 'precio', this.value)" />
                            <button onclick="eliminarEnlaceDeProducto(${index}, ${idx})">Eliminar</button>
                        </div>
                    `).join("")}
                    <button onclick="agregarEnlaceProducto(${index})">Agregar nuevo enlace</button>
                </div>

                <button onclick="eliminarProducto(${index})" style="margin-top:10px;">Eliminar película</button>
            `;
            cont.appendChild(div);
        });
    }

    function eliminarProducto(index) {
        let userConfirmed = confirm("¿Eliminar esta película?");
        if (!userConfirmed){
            return;
        } 
        let peliculas = JSON.parse(localStorage.getItem("peliculas") || "[]");
        peliculas.splice(index, 1);
        localStorage.setItem("peliculas", JSON.stringify(peliculas));
        mostrarProductos();
    }

    function agregarEnlaceProducto(indexProducto) {
        const peliculas = JSON.parse(localStorage.getItem("peliculas") || "[]");
        const pelicula = peliculas[indexProducto];

        if (pelicula) {
            if (!pelicula.Enlaces){
                pelicula.Enlaces = []; 
            } 
            pelicula.Enlaces.push({ titulo: "", enlace: "", precio: "" });
        
            localStorage.setItem("peliculas", JSON.stringify(peliculas));
            mostrarProductos();
        }
    }

    function editarCampo(index, campo, valor) {
        const peliculas = JSON.parse(localStorage.getItem("peliculas") || "[]");
        const p = peliculas[index];

        if (p) {
            p[campo] = valor;
            localStorage.setItem("peliculas", JSON.stringify(peliculas));
            mostrarProductos();
        }
    }

    function editarEnlace(indexProducto, indexEnlace, campo, valor) {
        const peliculas = JSON.parse(localStorage.getItem("peliculas") || "[]");
        const p = peliculas[indexProducto];

        if (p && p.Enlaces[indexEnlace]) {
            p.Enlaces[indexEnlace][campo] = valor;
            localStorage.setItem("peliculas", JSON.stringify(peliculas));
            mostrarProductos();
        }
    }

    function eliminarEnlaceDeProducto(indexProducto, indexEnlace) {
        const peliculas = JSON.parse(localStorage.getItem("peliculas") || "[]");
        const p = peliculas[indexProducto];

        if (p) {
            p.Enlaces.splice(indexEnlace, 1);
            localStorage.setItem("peliculas", JSON.stringify(peliculas));
            mostrarProductos();
        }
    }


    function eliminarProducto(index) {
        if (!confirm("¿Eliminar esta película?")){
            return;
        } 
        let peliculas = JSON.parse(localStorage.getItem("peliculas") || "[]");
        peliculas.splice(index, 1);
        localStorage.setItem("peliculas", JSON.stringify(peliculas));
        mostrarProductos();
    }

    mostrarProductos();