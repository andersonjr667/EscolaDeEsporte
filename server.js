const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

// Servir frontend estático
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
