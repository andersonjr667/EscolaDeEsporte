document.addEventListener("DOMContentLoaded", async () => {
    const tabelaAlunos = document.getElementById("tabela-alunos");

    try {
        const response = await fetch('/api/alunos');
        const alunos = await response.json();

        alunos.forEach(aluno => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${aluno.nome}</td>
                             <td>${aluno.escola}</td>
                             <td>${aluno.sala}</td>
                             <td>${aluno.statusPagamento}</td>`;
            tabelaAlunos.appendChild(row);
        });
    } catch (error) {
        console.error("Erro ao carregar alunos:", error);
    }

    document.getElementById('create-aluno-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const escola = document.getElementById('escola').value;
        const sala = document.getElementById('sala').value;
        const statusPagamento = document.getElementById('statusPagamento').value;

        try {
            const response = await fetch('/api/alunos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, escola, sala, statusPagamento })
            });
            const novoAluno = await response.json();
            const row = document.createElement("tr");
            row.innerHTML = `<td>${novoAluno.nome}</td>
                             <td>${novoAluno.escola}</td>
                             <td>${novoAluno.sala}</td>
                             <td>${novoAluno.statusPagamento}</td>`;
            tabelaAlunos.appendChild(row);
            $('#createAlunoModal').modal('hide');
        } catch (error) {
            console.error("Erro ao criar aluno:", error);
        }
    });
});
