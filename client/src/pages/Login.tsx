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
    <section className="min-h-dvh flex flex-col justify-center p-4">
      <div className="bg-neutral-200 p-4 rounded-lg shadow-lg text-center max-w-screen-sm mx-auto text-neutral-900">
        <form className="flex flex-col gap-2 p-10" onSubmit={onSubmit} autoComplete="off">
          <h2 className="text-3xl mb-6">Admin Login</h2>
          {error && <div className="error">{error}</div>}
          <input
            className="th-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            autoComplete="off"
            name="email"
          />
          <input
            className="th-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            autoComplete="new-password"
            name="password"
          />
          
          <button className="primary-button block mx-auto" disabled={submitting}>{submitting ? "..." : "Login"}</button>
        </form>
      </div>  

    </section>

  );
}
