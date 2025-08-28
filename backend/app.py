from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector
import os
from pdfminer.high_level import extract_text
import docx
import spacy

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Connexion base de données
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='',
    database='recrutement_db'
)
cursor = conn.cursor(dictionary=True)

# Charger modèle spaCy français
nlp = spacy.load('fr_core_news_sm')

# --- Extraction texte CV ---
def extract_text_from_cv(cv_path):
    ext = os.path.splitext(cv_path)[1].lower()
    text = ""
    if ext == '.pdf':
        text = extract_text(cv_path)
    elif ext == '.docx':
        doc = docx.Document(cv_path)
        text = '\n'.join([para.text for para in doc.paragraphs])
    else:
        text = ""
    return text

# --- Analyse NLP simple ---
def analyze_cv_text(text):
    doc = nlp(text)

    formation = []
    experience = []
    competences = []

    keywords_formation = ['Master', 'Licence', 'Doctorat', 'BTS', 'Ingénieur']
    keywords_experience = ['expérience', 'stage', 'travail', 'freelance', 'CDD', 'CDI']
    keywords_competence = ['Python', 'Java', 'React', 'Flask', 'SQL', 'Machine Learning']

    for token in doc:
        if token.text in keywords_formation:
            formation.append(token.text)
        if token.text in keywords_experience:
            experience.append(token.text)
        if token.text in keywords_competence:
            competences.append(token.text)

    return {
        'formation': list(set(formation)),
        'experience': list(set(experience)),
        'competences': list(set(competences))
    }

# --- Calcul score ---
def calculate_score(analysis):
    score = 0
    score += len(analysis['formation']) * 20
    score += len(analysis['experience']) * 20
    score += len(analysis['competences']) * 10
    return min(score, 100)

# --- Route inscription candidat ---
@app.route('/register', methods=['POST'])
def register():
    nom = request.form.get('nom')
    email = request.form.get('email')
    telephone = request.form.get('telephone')
    cv_file = request.files.get('cv')

    if not all([nom, email, telephone, cv_file]):
        return jsonify({'message': 'Tous les champs sont obligatoires.'}), 400

    cv_filename = cv_file.filename
    cv_path = os.path.join(app.config['UPLOAD_FOLDER'], cv_filename)
    cv_file.save(cv_path)

    # Extraire texte et analyser
    texte_cv = extract_text_from_cv(cv_path)
    analysis = analyze_cv_text(texte_cv)
    score = calculate_score(analysis)

    formation_str = ', '.join(analysis['formation'])
    experience_str = ', '.join(analysis['experience'])
    competences_str = ', '.join(analysis['competences'])

    # Enregistrer en BDD
    sql = """
    INSERT INTO candidat (nom, email, telephone, cv_filename, formation, experience, competences, score)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (nom, email, telephone, cv_filename, formation_str, experience_str, competences_str, score))
    conn.commit()

    return jsonify({'message': 'Candidat enregistré avec succès !', 'score': score})

# --- Route login admin ---
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    cursor.execute("SELECT * FROM admin WHERE username=%s AND password=%s", (username, password))
    admin = cursor.fetchone()
    if admin:
        return jsonify({'message': 'Connexion réussie'})
    else:
        return jsonify({'message': 'Identifiants invalides'}), 401

# --- Route liste candidats ---
@app.route('/candidats', methods=['GET'])
def get_candidats():
    cursor.execute("SELECT * FROM candidat ORDER BY score DESC")
    candidats = cursor.fetchall()
    return jsonify(candidats)

# --- Route téléchargement CV ---
@app.route('/download-cv/<filename>', methods=['GET'])
def download_cv(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)

# --- Run server ---
if __name__ == '__main__':
    app.run(port=5000, debug=True)
