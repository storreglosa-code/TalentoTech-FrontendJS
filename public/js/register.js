  // ----- Config -----
  // Cambiá esto cuando publiques en staging/prod.
  const API_BASE = 'https://localhost:7163'; // o 'https://staging.tutienda.online'

  // ----- Elementos -----
  const form = document.getElementById('registerForm');
  const submitBtn = document.getElementById('submitBtn');
  const messageEl = document.getElementById('message');

  function renderToLogin(){
    window.location.href = '/login.html'
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.value = isLoading ? 'Enviando...' : 'Registrarse';
  }

  function clearMessages() {
    messageEl.textContent = '';
    messageEl.className = '';
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
  }

  function showMessage(text, type = 'info') {
    messageEl.textContent = text;
    messageEl.className = type; // define .info .success .error en CSS
  }

  function showFieldErrors(errors) {
    // errors: { fieldName: ["msg1","msg2"], ... }
    if (!errors) return;

    // Normalizo nombres comunes (por si la API devuelve "Email", "email", etc.)
    const normalize = name => name.toString().toLowerCase().replace(/[^a-z0-9]/g, '');

    Object.keys(errors).forEach(field => {
      const norm = normalize(field);
      // Intento match con data-error-for tal cual o con variantes
      let span = document.querySelector(`[data-error-for="${field}"]`);
      if (!span) {
        // buscar por normalización: emailAddress -> emailaddress
        span = Array.from(document.querySelectorAll('.error'))
          .find(s => normalize(s.getAttribute('data-error-for')) === norm);
      }
      if (span) span.textContent = Array.isArray(errors[field]) ? errors[field].join(' ') : errors[field];
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    const data = {
      name: form.name.value.trim(),
      emailAddress: form.emailAddress.value.trim(),
      password: form.password.value,
      referencia: form.referencia.value || null
    };

    try {
        //   const res = await fetch('${API_BASE}/api/Authentication/Register', {
        const res = await fetch(`${API_BASE}/api/Authentication/Register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const contentType = (res.headers.get('Content-Type') || '').toLowerCase();
      let payload;
      if (contentType.includes('application/json')) {
        payload = await res.json();
      } else {
        payload = { message: await res.text() };
      }

      if (res.ok) {
        // Si la API devuelve un mensaje, lo mostramos; sino usamos uno por defecto
        const successMsg = payload.message || 'Registro exitoso. Revisa tu correo para confirmar.';
        showMessage(successMsg, 'success');

        // Opcional: redirigir al login después de X segundos
        setTimeout(()=> window.location.href = '/index.html', 1500);
      } else {
        // Manejo de errores: estructura esperada { errors: { field: [...] }, message: "..."}
        if (payload.errors) {
          showFieldErrors(payload.errors);
        }

        // A veces la API devuelve validationResult con different structure:
        if (payload.ModelState) {
          showFieldErrors(payload.ModelState);
        }

        const errMsg = payload.message || payload.Message || JSON.stringify(payload);
        showMessage(`Error ${res.status}: ${errMsg}`, 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage('Error de red o conexión. Verifica que la API esté corriendo.', 'error');
    } finally {
      setLoading(false);
    }
  });