const mongoose = require('mongoose');

const AlunoSchema = new mongoose.Schema({
    nome: String,
    escola: String,
    sala: String,
    statusPagamento: String
});

module.exports = mongoose.model('Aluno', AlunoSchema);
