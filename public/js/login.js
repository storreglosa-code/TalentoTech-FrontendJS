const API_BASE = "https://localhost:7163";

const form = document.getElementById("loginForm");
const msg = document.getElementById("message");

function showMessage(text, type) {
  msg.textContent = text;
  msg.className = type;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  login(
    document.getElementById("email").value,
    document.getElementById("password").value
  );
});


async function login(email, password) {
  const data = {
    email: email,
    password: password
  };

  try {
    const res = await fetch(`${API_BASE}/api/Authentication/Login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const payload = await res.json();
    
    // SI LA API RESPONDE OK
    if (res.ok && payload?.result?.result === true) {
      console.log(payload);
      const token = payload.result.token;
      const refreshToken = payload.result.refreshToken;
      const userName = payload.result.userName;
      const clientId = payload.result.clientId;

      // Guardamos token en localStorage
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userName", userName);
      localStorage.setItem("clientId", clientId);


      showMessage("Login exitoso ✅", "success");

      // Redirigir al home
      setTimeout(() => {
        window.location.href = "index.html";
      }, 800);

    } else {
      // Manejo de errores
      const errors = payload?.result?.errors;
      if (errors && Array.isArray(errors)) {
        showMessage(errors.join(", "), "error");
      } else {
        showMessage("Credenciales inválidas ❌", "error");
      }
    }

  } catch (err) {
    console.error(err);
    showMessage("Error de conexión ⚠️", "error");
  }
}
