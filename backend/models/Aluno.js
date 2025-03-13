const mongoose = require('mongoose');

const AlunoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    escola: {
        type: String,
        required: true
    },
    sala: {
        type: String,
        required: true
    },
    statusPagamento: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Aluno', AlunoSchema);
