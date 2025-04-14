// CLIENTES
const clienteApi = 'http://localhost:3000/clientes';
const clienteForm = document.getElementById('clienteForm');
const clienteId = document.getElementById('clienteId');
const clientesTable = document.getElementById('clientesTable');

function carregarClientes() {
    fetch(clienteApi)
        .then(res => res.json())
        .then(clientes => {
            clientesTable.innerHTML = '';
            clientes.forEach(c => {
                const row = document.createElement('tr');

                const editarBtn = document.createElement('button');
                editarBtn.textContent = 'Editar';
                editarBtn.onclick = () => editarCliente(c.id, c.nome, c.sobrenome, c.email, c.idade);

                const deletarBtn = document.createElement('button');
                deletarBtn.textContent = 'Excluir';
                deletarBtn.onclick = () => deletarCliente(c.id);

                const actionsCell = document.createElement('td');
                actionsCell.appendChild(editarBtn);
                actionsCell.appendChild(deletarBtn);

                row.innerHTML = `
                    <td>${c.nome}</td>
                    <td>${c.sobrenome}</td>
                    <td>${c.email}</td>
                    <td>${c.idade}</td>
                `;
                row.appendChild(actionsCell);
                clientesTable.appendChild(row);
            });
        });
}

function editarCliente(id, nome, sobrenome, email, idade) {
    clienteId.value = id;
    clienteForm.nome.value = nome;
    clienteForm.sobrenome.value = sobrenome;
    clienteForm.email.value = email;
    clienteForm.idade.value = idade;
}

function deletarCliente(id) {
    if (confirm('Deseja realmente excluir este cliente?')) {
        fetch(`${clienteApi}/${id}`, { method: 'DELETE' })
            .then(() => carregarClientes());
    }
}

clienteForm.addEventListener('submit', e => {
    e.preventDefault();
    const cliente = {
        nome: clienteForm.nome.value,
        sobrenome: clienteForm.sobrenome.value,
        email: clienteForm.email.value,
        idade: parseInt(clienteForm.idade.value)
    };

    const id = clienteId.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${clienteApi}/${id}` : clienteApi;

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
    }).then(() => {
        clienteForm.reset();
        clienteId.value = '';
        carregarClientes();
    });
});

// PRODUTOS
const produtoApi = 'http://localhost:3000/produtos';
const produtoForm = document.getElementById('produtoForm');
const produtoId = document.getElementById('produtoId');
const produtosTable = document.getElementById('produtosTable');

function carregarProdutos() {
    fetch(produtoApi)
        .then(res => res.json())
        .then(produtos => {
            produtosTable.innerHTML = '';
            produtos.forEach(p => {
                const row = document.createElement('tr');

                const editarBtn = document.createElement('button');
                editarBtn.textContent = 'Editar';
                editarBtn.onclick = () => editarProduto(p.id, p.nome, p.descricao, p.preco);

                const deletarBtn = document.createElement('button');
                deletarBtn.textContent = 'Excluir';
                deletarBtn.onclick = () => deletarProduto(p.id);

                const actionsCell = document.createElement('td');
                actionsCell.appendChild(editarBtn);
                actionsCell.appendChild(deletarBtn);

                row.innerHTML = `
                    <td>${p.nome}</td>
                    <td>${p.descricao}</td>
                    <td>R$ ${parseFloat(p.preco).toFixed(2)}</td>
                    <td>${new Date(p.data_atualizado).toLocaleString()}</td>
                `;
                row.appendChild(actionsCell);
                produtosTable.appendChild(row);
            });
        });
}

function editarProduto(id, nome, descricao, preco) {
    produtoId.value = id;
    produtoForm.produtoNome.value = nome;
    produtoForm.descricao.value = descricao;
    produtoForm.preco.value = preco;
}

function deletarProduto(id) {
    if (confirm('Deseja realmente excluir este produto?')) {
        fetch(`${produtoApi}/${id}`, { method: 'DELETE' })
            .then(() => carregarProdutos());
    }
}

produtoForm.addEventListener('submit', e => {
    e.preventDefault();
    const produto = {
        nome: produtoForm.produtoNome.value,
        descricao: produtoForm.descricao.value,
        preco: parseFloat(produtoForm.preco.value)
    };

    const id = produtoId.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${produtoApi}/${id}` : produtoApi;

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
    }).then(() => {
        produtoForm.reset();
        produtoId.value = '';
        carregarProdutos();
    });
});

// INICIALIZAÇÃO
carregarClientes();
carregarProdutos();
