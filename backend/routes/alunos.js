const express = require('express');
const router = express.Router();
const Aluno = require('../models/Aluno');

// Rota para obter todos os alunos
router.get('/', async (req, res) => {
    try {
        const alunos = await Aluno.find();
        res.json(alunos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Rota para criar um novo aluno
router.post('/', async (req, res) => {
    const aluno = new Aluno({
        nome: req.body.nome,
        escola: req.body.escola,
        sala: req.body.sala,
        statusPagamento: req.body.statusPagamento
    });

    try {
        const novoAluno = await aluno.save();
        res.status(201).json(novoAluno);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
