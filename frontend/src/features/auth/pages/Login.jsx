import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import "../style/AuthStyle.scss";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [identifier, setIdentifier] = useState("")
const [password, setPassword] = useState("")
const {loading,handleLogin} = useAuth()
const navigate = useNavigate()

async function handelSubmit(e) {
  e.preventDefault();

  if (loading) return;
  if (!identifier || !password) return;

  try {
    const isEmail = identifier.includes("@");

    const payload = {
      password,
      ...(isEmail ? { email: identifier } : { username: identifier }),
    };

    const res = await handleLogin(payload);

    if (res?.user) {
      navigate("/");
    }
  } catch (error) {
    console.log(error);
  }
}

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Login</h2>

        <div className="social-login">
          <button type="button">
            <FcGoogle size={18} /> Google
          </button>
          <button type="button">
            <FaGithub size={18} /> GitHub
          </button>
          <button type="button">
            <FaLinkedin size={18} /> LinkedIn
          </button>
        </div>

        <form onSubmit={handelSubmit}>
          <div className="input-group">
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <label>Email or Username</label>
          </div>

          <div className="input-group">
            {/* Show/Hide Logic for Password */}
            <input
              type={showPass ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <label>Password</label>

            <span onClick={() => setShowPass(!showPass)}>
              {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            Login
            <LogIn size={18} />
          </button>
        </form>

        <p className="auth-switch">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
