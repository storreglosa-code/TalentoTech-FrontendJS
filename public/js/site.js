// Obtener userName del localStorage
const userName = localStorage.getItem("userName");
const token = localStorage.getItem("accessToken");

const welcomeEl = document.getElementById("welcome");
const logoutBtn = document.getElementById("logoutBtn");

if (token && userName) {
    welcomeEl.textContent = `Hola, ${userName}!`;
    logoutBtn.style.display = "inline";
} else {
    // usuario no logueado → ocultar logout
    logoutBtn.style.display = "none";
}

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userName");
    window.location.href = "login.html";
});



const API_BASE = "https://localhost:7163";
async function loadProducts() {
const token = localStorage.getItem("accessToken");

    if (!token) {
        console.warn("Usuario no autenticado, redirigiendo al login");
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/Products`, {
        headers: { 
            "Authorization": `Bearer ${token}`
        }
        });

        const products = await res.json();

        const container = document.getElementById("prod-container");
        container.innerHTML = ""; // limpiar

        products.forEach(p => {
        container.innerHTML += `
            <div class="prod-item">
            <div class="tit-item">
                ${p.name}
            </div>

            <div class="item-img">
                <img class="imagen-card" src="media/biblioteca1_600.jpg" alt="Biblioteca clasica">
            </div>
            <div class="datos">
                <span class="precio-old"> $${p.price} </span> 
                <span class="off texto"> 20% off </span> 
                <br>
                <span class="precio"> $${p.price*0.8} </span> 
            </div>
            <div class="botonera">
                <button class="btn-agregar" onclick="addToCart(${p.id}, '${p.name}', ${p.price})"> Agregar </button>
            </div>
        </div>
        `;
        });

    } catch (err) {
        console.error(err);
        alert("Error cargando productos");
    }
}

loadProducts(); // ejecutamos al cargar la página

function addToCart(id, name, price) {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        cart.push({ id, name, price, qty: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${name} agregado al carrito ✅`);
    }
