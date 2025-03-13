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
});
