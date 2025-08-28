import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/login', credentials);
      setMessage({ text: 'Connexion réussie !', type: 'success' });
      setTimeout(() => navigate('/dashboard-admin'), 1500);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ text: 'Identifiants incorrects', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Connexion Admin</h2>
        <p style={styles.subtitle}>Accédez à votre espace d'administration</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          
          <button 
            type="submit" 
            style={isSubmitting ? styles.buttonSubmitting : styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        
        {message && (
          <p style={message.type === 'success' ? styles.messageSuccess : styles.messageError}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4, #3b82f6)',
    backgroundSize: '400% 400%',
    animation: 'gradientShift 15s ease infinite',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    color: 'white',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    animation: 'fadeIn 0.8s ease-out',
  },
  title: {
    fontSize: '2.2rem',
    marginBottom: '10px',
    textAlign: 'center',
    fontWeight: '700',
    color: 'white',
  },
  subtitle: {
    fontSize: '1rem',
    marginBottom: '30px',
    textAlign: 'center',
    opacity: 0.9,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    fontSize: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    transition: 'all 0.3s ease',
  },
  button: {
    backgroundColor: 'white',
    color: '#3b82f6',
    fontWeight: '600',
    border: 'none',
    padding: '16px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    marginTop: '10px',
  },
  buttonSubmitting: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    color: '#3b82f6',
    fontWeight: '600',
    border: 'none',
    padding: '16px',
    borderRadius: '10px',
    cursor: 'not-allowed',
    fontSize: '1rem',
    marginTop: '10px',
  },
  messageSuccess: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    border: '1px solid rgba(16, 185, 129, 0.5)',
    borderRadius: '8px',
    textAlign: 'center',
  },
  messageError: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid rgba(239, 68, 68, 0.5)',
    borderRadius: '8px',
    textAlign: 'center',
  },
};

export default LoginAdmin;