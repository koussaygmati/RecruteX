import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardAdmin = () => {
  const [candidats, setCandidats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Charger la liste des candidats depuis le backend
    axios.get('http://localhost:5000/candidats')
      .then(response => {
        // Trier par score décroissant
        const sorted = response.data.sort((a, b) => b.score - a.score);
        setCandidats(sorted);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des candidats', error);
      });
  }, []);

  const handleReturn = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button onClick={handleReturn} style={styles.returnButton}>
            ← Retour à l'accueil
          </button>
        </div>
        <h2 style={styles.title}>Dashboard Admin</h2>
        <p style={styles.subtitle}>Liste des candidats par ordre de pertinence</p>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>Nom</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Téléphone</th>
              <th style={styles.th}>Formation</th>
              <th style={styles.th}>Expériences</th>
              <th style={styles.th}>Compétences</th>
              <th style={styles.th}>Score</th>
            </tr>
          </thead>
          <tbody>
            {candidats.map((candidat, index) => (
              <tr key={index} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td style={styles.td}>{candidat.nom}</td>
                <td style={styles.td}>{candidat.email}</td>
                <td style={styles.td}>{candidat.telephone}</td>
                <td style={styles.td}>{candidat.formation}</td>
                <td style={styles.td}>{candidat.experience}</td>
                <td style={styles.td}>{candidat.competences}</td>
                <td style={styles.scoreCell}>
                  <div style={styles.scoreBarContainer}>
                    <div 
                      style={{
                        ...styles.scoreBar,
                        width: `${candidat.score}%`,
                        backgroundColor: getScoreColor(candidat.score)
                      }}
                    />
                    <span style={styles.scoreText}>{candidat.score}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Fonction pour déterminer la couleur en fonction du score
const getScoreColor = (score) => {
  if (score >= 80) return '#10B981'; // Vert
  if (score >= 50) return '#F59E0B'; // Orange
  return '#EF4444'; // Rouge
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4, #3b82f6)',
    backgroundSize: '400% 400%',
    animation: 'gradientShift 15s ease infinite',
    color: 'white',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    marginBottom: '40px',
    textAlign: 'center',
    position: 'relative'
  },
  headerTop: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '10px 0'
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
      transform: 'translateY(-2px)'
    }
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    fontWeight: '700',
    color: 'white',
    marginTop: '40px'
  },
  subtitle: {
    fontSize: '1.2rem',
    opacity: 0.9,
    marginBottom: '0'
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    minWidth: '800px'
  },
  headerRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)'
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    fontWeight: '600',
    borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
    position: 'sticky',
    top: '0',
    backdropFilter: 'blur(10px)'
  },
  td: {
    padding: '16px',
    textAlign: 'left',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  rowEven: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  },
  rowOdd: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)'
  },
  scoreCell: {
    padding: '16px',
    minWidth: '120px'
  },
  scoreBarContainer: {
    position: 'relative',
    height: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  scoreBar: {
    height: '100%',
    borderRadius: '12px',
    transition: 'width 0.5s ease'
  },
  scoreText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'white',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
  }
};

// Ajout des animations CSS
const styleElement = document.createElement('style');
styleElement.innerHTML = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;
document.head.appendChild(styleElement);

export default DashboardAdmin;