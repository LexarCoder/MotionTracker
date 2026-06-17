import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import "../style/AuthStyle.scss";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { loading, handleRegister } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");

      const res = await handleRegister({
        username,
        email,
        password,
      });

      if (res) navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Register</h2>

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

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              required
              minLength={3}
              maxLength={20}
              value={username}
              disabled={loading}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Username</label>
          </div>

          <div className="input-group">
            <input
              type="email"
              required
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
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

          <button disabled={loading} className="primary-btn" type="submit">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
