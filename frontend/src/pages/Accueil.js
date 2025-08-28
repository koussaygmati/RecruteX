import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Accueil = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Création d'une balise style pour nos animations
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .hover-pulse:hover {
        animation: pulse 0.5s ease;
      }
    `;
    document.head.appendChild(styleElement);

    // Nettoyage
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>🚀 RecruteX</h1>
        <p style={styles.description}>
          La solution de recrutement automatique assistée par Intelligence Artificielle.
          Sélectionnez vos candidats simplement à partir de leur CV !
        </p>
        <p style={styles.slogan}>Trouvez le meilleur candidat en un seul clic</p>

        <div style={styles.buttonContainer}>
          <button 
            style={styles.buttonPrimary} 
            onClick={() => navigate('/inscription')}
            className="hover-pulse"
          >
            Inscription Candidat
          </button>
          <button 
            style={styles.buttonSecondary} 
            onClick={() => navigate('/login-admin')}
            className="hover-pulse"
          >
            Connexion Admin
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4, #3b82f6)',
    backgroundSize: '400% 400%',
    animation: 'gradientShift 15s ease infinite',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    overflow: 'hidden',
  },
  content: {
    maxWidth: '900px',
    padding: '40px',
    textAlign: 'center',
  },
  title: {
    fontSize: '4.5rem',
    marginBottom: '25px',
    animation: 'fadeIn 1s ease forwards',
    textShadow: '0 4px 10px rgba(0,0,0,0.2)',
    fontWeight: '800',
  },
  description: {
    fontSize: '1.5rem',
    marginBottom: '30px',
    animation: 'fadeIn 1.2s ease forwards 0.2s',
    opacity: 0,
    lineHeight: '1.6',
  },
  slogan: {
    fontSize: '1.8rem',
    marginBottom: '60px',
    fontStyle: 'italic',
    animation: 'fadeIn 1.4s ease forwards 0.4s',
    opacity: 0,
    fontWeight: '300',
  },
  buttonContainer: {
    display: 'flex',
    gap: '30px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  buttonPrimary: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '2px solid white',
    padding: '18px 40px',
    borderRadius: '50px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    backdropFilter: 'blur(5px)',
    animation: 'fadeIn 1.6s ease forwards 0.6s',
    opacity: 0,
    minWidth: '250px',
  },
  buttonSecondary: {
    background: 'rgba(255,255,255,0.9)',
    color: '#3b82f6',
    border: 'none',
    padding: '18px 40px',
    borderRadius: '50px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    animation: 'fadeIn 1.6s ease forwards 0.6s',
    opacity: 0,
    minWidth: '250px',
  }
};

// Ajout des styles hover directement dans le style object
styles.buttonPrimary[':hover'] = {
  background: 'rgba(255,255,255,0.3)',
  transform: 'translateY(-3px)',
  boxShadow: '0 6px 25px rgba(0,0,0,0.2)',
};

styles.buttonSecondary[':hover'] = {
  background: 'white',
  transform: 'translateY(-3px)',
  boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
};

export default Accueil;