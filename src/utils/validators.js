const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validators = {
  fullName: (v) => {
    const t = v.trim();
    if (!t) return "El nombre es obligatorio.";
    if (t.length < 3) return "Escribe tu nombre completo.";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return "El correo es obligatorio.";
    if (!EMAIL_RE.test(v.trim())) return "Escribe un correo válido.";
    return "";
  },
  phone: (v) => {
    const digits = v.replace(/\D/g, "");
    if (!digits) return "El teléfono es obligatorio.";
    if (digits.length !== 10) return "El teléfono debe tener 10 dígitos.";
    return "";
  },
  address: (v) => {
    if (!v.trim()) return "La dirección es obligatoria.";
    if (v.trim().length < 5) return "La dirección es demasiado corta.";
    return "";
  },
  city: (v) => (v.trim() ? "" : "La ciudad es obligatoria."),
  zip: (v) => {
    if (!v.trim()) return "El código postal es obligatorio.";
    if (!/^\d{5}$/.test(v.trim())) return "El código postal debe tener 5 dígitos.";
    return "";
  },
  paymentMethod: (v) => (v ? "" : "Elige un método de pago."),
};

export function validateAll(values) {
  const errors = {};
  for (const field of Object.keys(validators)) {
    const message = validators[field](values[field] ?? "");
    if (message) errors[field] = message;
  }
  return errors;
}