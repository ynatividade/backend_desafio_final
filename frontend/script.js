document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = 'http://localhost:3000';

    // Seletores de UI
    const publicView = document.getElementById('public-view');
    const appView = document.getElementById('app-view');
    const authControls = document.getElementById('auth-controls');
    const mainNav = document.getElementById('main-nav');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const welcomeMessage = document.getElementById('welcome-message');
    const logoutButton = document.getElementById('logout-button');
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Tabelas
    const produtosTablePublic = document.getElementById('produtosTablePublic');
    const produtosTablePrivate = document.getElementById('produtosTablePrivate');
    const clientesTableBody = document.getElementById('clientesTable');
    const usuariosList = document.getElementById('usuarios-list');
    
    // Formulários
    const clienteForm = document.getElementById('clienteForm');
    const produtoForm = document.getElementById('produtoForm');

    const updateUI = (isLoggedIn) => {
        publicView.classList.toggle('hidden', isLoggedIn);
        appView.classList.toggle('hidden', !isLoggedIn);
        mainNav.classList.toggle('hidden', !isLoggedIn);
        if (isLoggedIn) {
            authControls.classList.remove('hidden');
            welcomeMessage.textContent = `Bem-vindo(a), ${localStorage.getItem('username')}!`;
        } else {
            authControls.classList.add('hidden');
        }
    };
    
    // Função para alternar entre as seções logadas (Produtos, Clientes, Usuários)
    const switchSection = (targetId) => {
        contentSections.forEach(section => section.classList.toggle('hidden', section.id !== targetId));
        navButtons.forEach(button => button.classList.toggle('active', button.dataset.target === targetId));
    };

    /** FUNÇÕES DE AUTENTICAÇÃO **/
    const handleLogin = async (event) => {
        event.preventDefault();
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;
        loginError.textContent = '';
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, senha }),
            });
            if (!response.ok) throw new Error('Usuário ou senha inválidos.');
            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('username', usuario);
            initApp();
        } catch (error) {
            loginError.textContent = error.message;
        }
    };

    const handleLogout = async () => {
        try {
            await authFetch(`${API_BASE_URL}/logout`, { method: 'POST' });
        } catch (error) {
            console.error('Erro no logout do servidor, mas deslogando localmente.', error);
        } finally {
            localStorage.clear();
            initApp();
        }
    };

    /** LÓGICA DE DADOS (API CALLS) **/
    const authFetch = async (url, options = {}) => {
        const token = localStorage.getItem('authToken');
        if (!token) { handleLogout(); throw new Error('Não autenticado'); }
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, ...options.headers };
        const response = await fetch(url, { ...options, headers });
        if (response.status === 401) { handleLogout(); throw new Error('Sessão expirada'); }
        if (!response.ok && response.status !== 204) throw new Error('Falha na requisição');
        return response.status === 204 ? null : response.json();
    };

    const loadPublicProducts = async () => {
        try {
            const produtos = await fetch(`${API_BASE_URL}/produtos`).then(res => res.json());
            renderProdutos(produtos, false, produtosTablePublic);
        } catch (error) {
            console.error('Erro ao carregar produtos públicos:', error);
        }
    };
    
    const loadPrivateData = async () => {
        try {
            const [produtos, clientes, usuarios] = await Promise.all([
                authFetch(`${API_BASE_URL}/produtos`),
                authFetch(`${API_BASE_URL}/clientes`),
                authFetch(`${API_BASE_URL}/usuarios`)
            ]);
            renderProdutos(produtos, true, produtosTablePrivate);
            renderClientes(clientes);
            renderUsuarios(usuarios);
        } catch (error) {
            console.error('Erro ao carregar dados privados:', error);
        }
    };
    
    /** RENDERIZAÇÃO E MANIPULAÇÃO DO DOM **/
    const renderProdutos = (produtos, isLoggedIn, tableBody) => {
        tableBody.innerHTML = '';
        if (!produtos || produtos.length === 0) return;

        produtos.forEach(p => {
            const row = tableBody.insertRow();
            row.innerHTML = `<td>${p.nome}</td><td>${p.descricao}</td><td>R$ ${parseFloat(p.preco).toFixed(2)}</td><td>${p.data_atualizado ? new Date(p.data_atualizado).toLocaleString('pt-BR') : 'N/A'}</td>`;
            if (isLoggedIn) {
                const actionsCell = row.insertCell();
                actionsCell.append(createButton('Editar', 'edit-btn', () => populateProdutoForm(p)));
                actionsCell.append(createButton('Excluir', 'delete-btn', () => handleDelete('produtos', p.id, loadPrivateData)));
            }
        });
    };

    const renderClientes = (clientes) => {
        clientesTableBody.innerHTML = '';
        if (!clientes || clientes.length === 0) return;
        clientes.forEach(c => {
            const row = clientesTableBody.insertRow();
            row.innerHTML = `<td>${c.nome}</td><td>${c.sobrenome}</td><td>${c.email}</td><td>${c.idade}</td><td></td>`;
            const actionsCell = row.cells[4];
            actionsCell.append(createButton('Editar', 'edit-btn', () => populateClienteForm(c)));
            actionsCell.append(createButton('Excluir', 'delete-btn', () => handleDelete('clientes', c.id, loadPrivateData)));
        });
    };
    
    const renderUsuarios = (usuarios) => {
        usuariosList.innerHTML = '';
        if (!usuarios || usuarios.length === 0) return;
        usuariosList.innerHTML = `<ul class="list-disc pl-5 space-y-2">${usuarios.map(u => `<li>${u.usuario} <span class="text-gray-500">(ID: ${u.id})</span></li>`).join('')}</ul>`;
    };

    const handleFormSubmit = async (e, resource) => {
        e.preventDefault();
        let id, body, form;
        if (resource === 'produtos') {
            form = produtoForm;
            id = document.getElementById('produtoId').value;
            body = { nome: form.produtoNome.value, descricao: form.descricao.value, preco: parseFloat(form.preco.value) };
        } else {
            form = clienteForm;
            id = document.getElementById('clienteId').value;
            body = { nome: form.nome.value, sobrenome: form.sobrenome.value, email: form.email.value, idade: parseInt(form.idade.value) };
        }
        await authFetch(id ? `${API_BASE_URL}/${resource}/${id}` : `${API_BASE_URL}/${resource}`, { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
        form.reset(); 
        if(resource === 'produtos') document.getElementById('produtoId').value = '';
        else document.getElementById('clienteId').value = '';
        loadPrivateData();
    };

    const populateProdutoForm = (p) => {
        produtoForm.produtoId.value = p.id;
        produtoForm.produtoNome.value = p.nome;
        produtoForm.descricao.value = p.descricao;
        produtoForm.preco.value = p.preco;
        produtoForm.scrollIntoView({ behavior: 'smooth' });
    };

    const populateClienteForm = (c) => {
        clienteForm.clienteId.value = c.id;
        clienteForm.nome.value = c.nome;
        clienteForm.sobrenome.value = c.sobrenome;
        clienteForm.email.value = c.email;
        clienteForm.idade.value = c.idade;
        clienteForm.scrollIntoView({ behavior: 'smooth' });
    };

    const createButton = (text, className, onClick) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = className;
        button.onclick = onClick;
        return button;
    };

    const handleDelete = async (resource, id, callback) => {
        if (!confirm(`Deseja realmente excluir este item?`)) return;
        await authFetch(`${API_BASE_URL}/${resource}/${id}`, { method: 'DELETE' });
        callback();
    };
    
    /** INICIALIZAÇÃO DA APLICAÇÃO **/
    const initApp = () => {
        const isLoggedIn = !!localStorage.getItem('authToken');
        updateUI(isLoggedIn);

        if (isLoggedIn) {
            loadPrivateData();
            switchSection('produtos-section');
        } else {
            loadPublicProducts();
        }
    };
    
    // Listeners de eventos
    loginForm.addEventListener('submit', handleLogin);
    logoutButton.addEventListener('click', handleLogout);
    navButtons.forEach(button => button.addEventListener('click', () => switchSection(button.dataset.target)));
    clienteForm.addEventListener('submit', (e) => handleFormSubmit(e, 'clientes'));
    produtoForm.addEventListener('submit', (e) => handleFormSubmit(e, 'produtos'));

    initApp();
});
