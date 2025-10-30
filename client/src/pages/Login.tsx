import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@example.com"); // helps you test
  const [password, setPassword] = useState("secret123");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Form submitted with:', { email, password });
    setSubmitting(true);
    try {
      console.log('Calling login...');
      await login(email, password);
      console.log('Login completed, navigating...');
      // tiny delay to let autofill/overlay chill
      await new Promise((resolve) => setTimeout(resolve, 150));
      navigate("/", { replace: true });
    } catch (err) {
      console.error('Login failed in component:', err);
      // error is already set in context, so we don't need to do much here
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} autoComplete="off" style={{ maxWidth: 360, margin: "80px auto" }}>
      <h2>Admin Login</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
        autoComplete="off"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        autoComplete="new-password"
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button disabled={submitting}>{submitting ? "..." : "Login"}</button>
    </form>
  );
}
