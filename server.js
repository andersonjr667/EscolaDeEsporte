const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ error: 'Acesso negado' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send({ error: 'Token inválido' });
    }
};

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Rotas
const alunosRoutes = require('./backend/routes/alunos');
app.use('/api/alunos', authMiddleware, alunosRoutes);

// Rota de login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    // Verifique o usuário e a senha no banco de dados
    // Aqui está um exemplo simples, você deve substituir pela lógica real
    if (username === 'admin' && password === 'admin') {
        const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.send({ token });
    }
    res.status(401).send({ error: 'Credenciais inválidas' });
});

// Rota para criar post
app.post('/api/posts', authMiddleware, upload.fields([{ name: 'image' }, { name: 'video' }, { name: 'files' }]), (req, res) => {
    const { title, text } = req.body;
    const image = req.files['image'] ? req.files['image'][0].path : null;
    const video = req.files['video'] ? req.files['video'][0].path : null;
    const files = req.files['files'] ? req.files['files'].map(file => file.path) : [];

    // Salvar post no banco de dados (exemplo simples)
    // Substitua pela lógica real de salvar no banco de dados
    const post = { title, text, image, video, files };
    console.log('Post criado:', post);
    res.status(201).send({ message: 'Post criado com sucesso', post });
});

// Servir frontend estático
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
