import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { validators, validateAll } from "../utils/validators";
import { formatPrice } from "../utils/format";
import FormField from "../components/FormField";

function createOrderId() {
  return "PED-" + Date.now().toString(36).toUpperCase();
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const orderPlaced = useRef(false);

  const [values, setValues] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email ?? "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    paymentMethod: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Si el carrito está vacío, no hay nada que pagar.
  // La referencia evita redirigir al carrito justo después de confirmar.
  if (items.length === 0 && !orderPlaced.current) {
    return <Navigate to="/carrito" replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Si el campo ya tenía error, se revalida mientras escribe
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validateAll(values);
    setErrors(found);
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])));

    if (Object.keys(found).length > 0) {
      // Lleva el foco al primer campo con error
      const first = Object.keys(found)[0];
      document.getElementById(first)?.focus();
      return;
    }

    const order = {
      id: createOrderId(),
      date: new Date().toISOString(),
      customer: {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.replace(/\D/g, ""),
        address: values.address.trim(),
        city: values.city.trim(),
        zip: values.zip.trim(),
      },
      paymentMethod: values.paymentMethod,
      items: items.map((i) => ({ ...i })),
      total,
    };

    orderPlaced.current = true;
    navigate("/confirmacion", { state: { order }, replace: true });
    clearCart();
  }

  function inputProps(name) {
    return {
      id: name,
      name,
      value: values[name],
      onChange: handleChange,
      onBlur: handleBlur,
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `${name}-error` : undefined,
    };
  }

  return (
    <section className="checkout">
      <h1>Finalizar compra</h1>

      <div className="checkout-layout">
        <form onSubmit={handleSubmit} noValidate>
          <FormField id="fullName" label="Nombre completo" error={errors.fullName}>
            <input {...inputProps("fullName")} autoComplete="name" />
          </FormField>

          <FormField id="email" label="Correo electrónico" error={errors.email}>
            <input {...inputProps("email")} type="email" autoComplete="email" />
          </FormField>

          <FormField id="phone" label="Teléfono (10 dígitos)" error={errors.phone}>
            <input {...inputProps("phone")} type="tel" autoComplete="tel" />
          </FormField>

          <FormField id="address" label="Dirección" error={errors.address}>
            <input {...inputProps("address")} autoComplete="street-address" />
          </FormField>

          <FormField id="city" label="Ciudad" error={errors.city}>
            <input {...inputProps("city")} autoComplete="address-level2" />
          </FormField>

          <FormField id="zip" label="Código postal" error={errors.zip}>
            <input {...inputProps("zip")} inputMode="numeric" autoComplete="postal-code" />
          </FormField>

          <FormField id="paymentMethod" label="Método de pago" error={errors.paymentMethod}>
            <select {...inputProps("paymentMethod")}>
              <option value="">Selecciona una opción</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Efectivo">Efectivo contra entrega</option>
            </select>
          </FormField>

          <button type="submit">Confirmar pedido</button>
        </form>

        <aside className="order-summary">
          <h2>Resumen del pedido</h2>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <span>{item.title} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="cart-total">Total: <strong>{formatPrice(total)}</strong></p>
        </aside>
      </div>
    </section>
  );
}