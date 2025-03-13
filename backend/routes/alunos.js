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
        turma: req.body.turma,
        statusPagamento: req.body.statusPagamento,
        telefone: req.body.telefone,
        email: req.body.email
    });

    try {
        const novoAluno = await aluno.save();
        res.status(201).json(novoAluno);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Rota para atualizar o status de pagamento de um aluno
router.patch('/:id/statusPagamento', async (req, res) => {
    try {
        const aluno = await Aluno.findById(req.params.id);
        if (!aluno) {
            return res.status(404).json({ message: 'Aluno não encontrado' });
        }
        aluno.statusPagamento.set(req.body.mes, req.body.status);
        await aluno.save();
        res.json(aluno);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Rota para editar informações de um aluno
router.patch('/:id', async (req, res) => {
    try {
        const aluno = await Aluno.findById(req.params.id);
        if (!aluno) {
            return res.status(404).json({ message: 'Aluno não encontrado' });
        }
        Object.assign(aluno, req.body);
        await aluno.save();
        res.json(aluno);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Rota para excluir um aluno
router.delete('/:id', async (req, res) => {
    try {
        const aluno = await Aluno.findById(req.params.id);
        if (!aluno) {
            return res.status(404).json({ message: 'Aluno não encontrado' });
        }
        await aluno.remove();
        res.json({ message: 'Aluno excluído' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Rota para enviar cobrança no WhatsApp (simulado)
router.post('/:id/cobranca', async (req, res) => {
    try {
        const aluno = await Aluno.findById(req.params.id);
        if (!aluno) {
            return res.status(404).json({ message: 'Aluno não encontrado' });
        }
        // Simulação de envio de cobrança no WhatsApp
        res.json({ message: `Cobrança enviada para ${aluno.telefone}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
