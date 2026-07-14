import { useState } from "react";
import { C, SERIF, MONO, SANS } from "../theme";
import { useAuth } from "../lib/AuthContext";

export default function AuthModal({ onClose }) {
  const { signIn, signUp, configured } = useAuth();
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    const { error: err } =
      mode === "signin" ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (mode === "signup") {
      setNotice("Check your email to confirm your account, then sign in.");
      setMode("signin");
      return;
    }
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{ position:"fixed", inset:0, background:"rgba(26,42,58,.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:20 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background:C.paper, border:`1px solid ${C.rule}`, maxWidth:380, width:"100%", padding:32 }}
      >
        <div style={{ fontFamily:MONO, fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:".1em", marginBottom:8 }}>
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </div>
        <h2 style={{ fontFamily:SERIF, fontSize:24, fontWeight:700, color:C.ink, marginBottom:20 }}>
          {mode === "signin" ? "Sign in" : "Sign up"}
        </h2>

        {!configured && (
          <p style={{ fontFamily:SANS, fontSize:12, color:C.red, marginBottom:16, lineHeight:1.6 }}>
            Supabase isn't configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
            to your .env (see .env.example) to enable sign in and cross-device sync.
          </p>
        )}

        <form onSubmit={submit}>
          <label style={{ display:"block", fontFamily:MONO, fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:".06em", marginBottom:6 }}>Email</label>
          <input
            type="email" required value={email} onChange={e => setEmail(e.target.value)}
            disabled={!configured}
            style={{ width:"100%", padding:"10px 12px", border:`1px solid ${C.rule}`, background:C.bg, color:C.ink, fontFamily:SANS, fontSize:13, marginBottom:14 }}
          />
          <label style={{ display:"block", fontFamily:MONO, fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:".06em", marginBottom:6 }}>Password</label>
          <input
            type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
            disabled={!configured}
            style={{ width:"100%", padding:"10px 12px", border:`1px solid ${C.rule}`, background:C.bg, color:C.ink, fontFamily:SANS, fontSize:13, marginBottom:18 }}
          />

          {error && <p style={{ fontFamily:SANS, fontSize:12, color:C.red, marginBottom:14 }}>{error}</p>}
          {notice && <p style={{ fontFamily:SANS, fontSize:12, color:C.green, marginBottom:14 }}>{notice}</p>}

          <button
            type="submit" disabled={!configured || busy}
            style={{ width:"100%", background:C.ink, color:C.bg, fontFamily:SANS, fontSize:13, fontWeight:700, padding:"12px 0", opacity: busy ? .6 : 1 }}
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setNotice(""); }}
          style={{ marginTop:16, fontFamily:SANS, fontSize:12, color:C.blue, fontWeight:600 }}
        >
          {mode === "signin" ? "New here? Create an account →" : "Already have an account? Sign in →"}
        </button>

        <button onClick={onClose} style={{ marginTop:20, fontFamily:SANS, fontSize:12, color:C.muted }}>Close</button>
      </div>
    </div>
  );
}
