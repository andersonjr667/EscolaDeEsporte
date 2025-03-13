document.addEventListener("DOMContentLoaded", async () => {
    const tabelaAlunos = document.getElementById("tabela-alunos");

    try {
        const response = await fetch('/api/alunos');
        const alunos = await response.json();
        renderAlunos(alunos);
    } catch (error) {
        console.error("Erro ao carregar alunos:", error);
    }

    document.getElementById('create-aluno-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const escola = document.getElementById('escola').value;
        const turma = document.getElementById('turma').value;
        const telefone = document.getElementById('telefone').value;
        const email = document.getElementById('email').value;

        try {
            const response = await fetch('/api/alunos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, escola, turma, telefone, email })
            });
            const novoAluno = await response.json();
            renderAlunos([novoAluno]);
            $('#createAlunoModal').modal('hide');
        } catch (error) {
            console.error("Erro ao criar aluno:", error);
        }
    });

    document.getElementById('edit-aluno-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-id').value;
        const nome = document.getElementById('edit-nome').value;
        const escola = document.getElementById('edit-escola').value;
        const turma = document.getElementById('edit-turma').value;
        const telefone = document.getElementById('edit-telefone').value;
        const email = document.getElementById('edit-email').value;

        try {
            const response = await fetch(`/api/alunos/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, escola, turma, telefone, email })
            });
            const alunoAtualizado = await response.json();
            location.reload();
        } catch (error) {
            console.error("Erro ao editar aluno:", error);
        }
    });

    await populateFilters();
    renderChart();
});

function renderAlunos(alunos) {
    const tabelaAlunos = document.getElementById("tabela-alunos");
    tabelaAlunos.innerHTML = '';
    alunos.forEach(aluno => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${aluno.nome}</td>
                         <td>${aluno.escola}</td>
                         <td>${aluno.turma}</td>
                         <td>${aluno.telefone}</td>
                         <td>${aluno.email}</td>
                         <td>${getStatusPagamento(aluno.statusPagamento)}</td>
                         <td>
                            <button class="btn btn-warning" onclick="confirmarPagamento('${aluno._id}')">Confirmar Pagamento</button>
                            <button class="btn btn-success" onclick="enviarCobranca('${aluno._id}')">Enviar Cobrança</button>
                            <button class="btn btn-info" onclick="editarAluno('${aluno._id}')">Editar</button>
                            <button class="btn btn-danger" onclick="excluirAluno('${aluno._id}')">Excluir</button>
                         </td>`;
        tabelaAlunos.appendChild(row);
    });
    renderChart(alunos);
}

function getStatusPagamento(statusPagamento) {
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    return meses.map(mes => `${mes}: ${statusPagamento[mes] ? 'Pago' : 'Não Pago'}`).join('<br>');
}

async function confirmarPagamento(alunoId) {
    const mes = prompt("Digite o mês para confirmar o pagamento (ex: Janeiro):");
    if (!mes) return;

    try {
        const response = await fetch(`/api/alunos/${alunoId}/statusPagamento`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mes, status: true })
        });
        const alunoAtualizado = await response.json();
        location.reload();
    } catch (error) {
        console.error("Erro ao confirmar pagamento:", error);
    }
}

async function enviarCobranca(alunoId) {
    try {
        const response = await fetch(`/api/alunos/${alunoId}/cobranca`, {
            method: 'POST'
        });
        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error("Erro ao enviar cobrança:", error);
    }
}

async function editarAluno(alunoId) {
    try {
        const response = await fetch(`/api/alunos/${alunoId}`);
        const aluno = await response.json();
        document.getElementById('edit-id').value = aluno._id;
        document.getElementById('edit-nome').value = aluno.nome;
        document.getElementById('edit-escola').value = aluno.escola;
        document.getElementById('edit-turma').value = aluno.turma;
        document.getElementById('edit-telefone').value = aluno.telefone;
        document.getElementById('edit-email').value = aluno.email;
        $('#editAlunoModal').modal('show');
    } catch (error) {
        console.error("Erro ao carregar informações do aluno:", error);
    }
}

async function excluirAluno(alunoId) {
    if (!confirm("Tem certeza que deseja excluir este aluno?")) return;

    try {
        const response = await fetch(`/api/alunos/${alunoId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        alert(result.message);
        location.reload();
    } catch (error) {
        console.error("Erro ao excluir aluno:", error);
    }
}

async function verPagamentosNaoConcluidos() {
    try {
        const response = await fetch('/api/alunos');
        const alunos = await response.json();
        const alunosNaoConcluidos = alunos.filter(aluno => {
            return Object.values(aluno.statusPagamento).includes(false);
        });
        renderAlunos(alunosNaoConcluidos);
    } catch (error) {
        console.error("Erro ao carregar alunos:", error);
    }
}

async function verTodosAlunos() {
    try {
        const response = await fetch('/api/alunos');
        const alunos = await response.json();
        renderAlunos(alunos);
    } catch (error) {
        console.error("Erro ao carregar alunos:", error);
    }
}

function renderChart(alunos = []) {
    const ctx = document.getElementById('alunosChart').getContext('2d');
    const escolas = [...new Set(alunos.map(aluno => aluno.escola))];
    const data = escolas.map(escola => alunos.filter(aluno => aluno.escola === escola).length);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: escolas,
            datasets: [{
                label: 'Número de Alunos',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function exportToExcel() {
    const tabelaAlunos = document.getElementById("tabela-alunos");
    const wb = XLSX.utils.table_to_book(tabelaAlunos, { sheet: "Alunos" });
    XLSX.writeFile(wb, "alunos.xlsx");
}

async function populateFilters() {
    try {
        const response = await fetch('/api/alunos');
        const alunos = await response.json();
        const escolas = [...new Set(alunos.map(aluno => aluno.escola))];
        const turmas = [...new Set(alunos.map(aluno => aluno.turma))];

        const filtroEscola = document.getElementById('filtro-escola');
        const filtroTurma = document.getElementById('filtro-sala');

        escolas.forEach(escola => {
            const option = document.createElement('option');
            option.value = escola;
            option.textContent = escola;
            filtroEscola.appendChild(option);
        });

        turmas.forEach(turma => {
            const option = document.createElement('option');
            option.value = turma;
            option.textContent = turma;
            filtroTurma.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar filtros:", error);
    }
}

function filtrar() {
    const escola = document.getElementById('filtro-escola').value.toLowerCase();
    const turma = document.getElementById('filtro-sala').value.toLowerCase();
    const pagamento = document.getElementById('filtro-pagamento').value;

    fetch('/api/alunos')
        .then(response => response.json())
        .then(alunos => {
            const alunosFiltrados = alunos.filter(aluno => {
                const filtroEscola = escola ? aluno.escola.toLowerCase() === escola : true;
                const filtroTurma = turma ? aluno.turma.toLowerCase() === turma : true;
                const filtroPagamento = pagamento ? Object.values(aluno.statusPagamento).includes(pagamento === 'pago') : true;
                return filtroEscola && filtroTurma && filtroPagamento;
            });
            renderAlunos(alunosFiltrados);
        })
        .catch(error => console.error("Erro ao filtrar alunos:", error));
}
