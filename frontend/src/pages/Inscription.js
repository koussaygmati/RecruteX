import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Inscription = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    cv: null
  });

  const [message, setMessage] = useState('');
  const [fileName, setFileName] = useState('Aucun fichier sélectionné');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Ajout des animations CSS
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
      .file-upload:hover {
        transform: translateY(-2px);
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleReturn = () => {
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cv') {
      setFormData({ ...formData, cv: files[0] });
      setFileName(files[0] ? files[0].name : 'Aucun fichier sélectionné');
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    data.append('nom', formData.nom);
    data.append('email', formData.email);
    data.append('telephone', formData.telephone);
    data.append('cv', formData.cv);

    try {
      const response = await axios.post('http://localhost:5000/register', data);
      setMessage({ text: 'Enregistrement effectué avec succès !', type: 'success' });
      // Réinitialiser le formulaire après succès
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        cv: null
      });
      setFileName('Aucun fichier sélectionné');
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ text: "Erreur lors de l'enregistrement", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerTop}>
        <button onClick={handleReturn} style={styles.returnButton}>
          ← Retour à l'accueil
        </button>
      </div>
      
      <div style={styles.card}>
        <h2 style={styles.title}>Inscription Candidat</h2>
        <p style={styles.subtitle}>Rejoignez notre plateforme de recrutement intelligent</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nom Complet</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Téléphone</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.fileUploadContainer}>
            <label style={styles.fileUploadLabel} className="file-upload">
              <input
                type="file"
                name="cv"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleChange}
                required
                style={styles.inputFile}
              />
              <span style={styles.fileUploadButton}>Choisir un CV</span>
              <span style={styles.fileName}>{fileName}</span>
            </label>
          </div>
          
          <button 
            type="submit" 
            style={isSubmitting ? styles.buttonSubmitting : styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enregistrement...' : "S'inscrire"}
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    color: 'white',
    position: 'relative',
  },
  headerTop: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  returnButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(5px)',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.2)',
      transform: 'translateY(-2px)',
    },
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
  fileUploadContainer: {
    margin: '15px 0',
  },
  fileUploadLabel: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  fileUploadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    padding: '15px',
    borderRadius: '10px',
    textAlign: 'center',
    border: '1px dashed rgba(255, 255, 255, 0.4)',
    transition: 'all 0.3s ease',
  },
  fileName: {
    marginTop: '8px',
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  inputFile: {
    display: 'none',
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

export default Inscription;