document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos principais do HTML
    const appMainContent = document.getElementById('app-main-content');
    const navList = document.getElementById('main-nav-list');
    const menuToggleBtn = document.querySelector('.menu-toggle');

    /* ====================================================== */
    /* 1. NAVEGAÇÃO MOBILE (MENU HAMBÚRGUER)                  */
    /* ====================================================== */

    if (menuToggleBtn && navList) {
        menuToggleBtn.addEventListener('click', () => {
            // Alterna a classe 'open', que é usada no CSS para mostrar/esconder o menu
            navList.classList.toggle('open');
        });
    }

    /* ====================================================== */
    /* 2. SPA BÁSICO E TEMPLATES JAVASCRIPT (REQUISITO)       */
    /* ====================================================== */

    // Template para carregar o conteúdo da página PROJETOS
    const projetosPageTemplate = () => `
        <section id="capa-projetos" class="capa">
            <h1 class="text-white">Nossos Projetos</h1>
            <h4 class="text-white">Conheça as ações que estamos desenvolvendo</h4>
        </section>
        
        <section id="projetos-list" class="grid-container" style="padding: var(--s-xxl); text-align: center;">
            <h2>Projetos Ativos</h2>
            <p>Este conteúdo foi carregado dinamicamente via Template JavaScript (Template Literals).</p>
            
            <article class="col-4 card-projetos">
                <h3>Projeto Cidadão do Futuro</h3>
                <span class="badge badge-primary">Educação</span>
            </article>
            
            <article class="col-4 card-projetos">
                <h3>Nutrição Solidária</h3>
                <span class="badge badge-primary">Alimentação</span>
            </article>
            
            <article class="col-4 card-projetos">
                <h3>Capacitação Jovem</h3>
                <span class="badge badge-primary">Profissionalizante</span>
            </article>
        </section>
    `;

    // Função principal de carregamento de conteúdo (Simulando SPA)
    const loadContent = (pageName) => {
        // 1. Escolhe o template
        let newContent = '';
        if (pageName === 'projetos') {
            newContent = projetosPageTemplate();
        } else {
             // Se não for 'projetos', não faz nada, assume-se que é o conteúdo padrão da página
             return; 
        }

        // 2. Manipula o DOM para trocar o conteúdo
        if (newContent && appMainContent) {
            appMainContent.innerHTML = newContent;
            
            // 3. Atualiza a URL (SPA) - Necessário para o requisito de SPA
            history.pushState(null, '', `index.html#${pageName}`);
            window.scrollTo(0, 0); // Volta para o topo
        }
        
        // 4. Fecha o menu mobile após a navegação
        navList.classList.remove('open');
    };

    // Evento de clique para links de navegação
    document.querySelectorAll('#main-nav-list a').forEach(link => {
        link.addEventListener('click', (e) => {
            const pageName = e.target.getAttribute('data-page');
            const href = e.target.getAttribute('href');

            // Intercepta apenas o link "Projetos" para o SPA
            if (pageName === 'projetos') {
                e.preventDefault();
                loadContent(pageName);
            }
            
            // Para links de âncora (como #sobre), garante que o menu feche no mobile
            if (href && href.startsWith('#')) {
                 navList.classList.remove('open');
            }
        });
    });


    /* ====================================================== */
    /* 3. LÓGICA DO FORMULÁRIO DE CADASTRO (VALIDAÇÃO AVANÇADA)*/
    /* Esta lógica é essencial para o requisito de verificação*/
    /* ====================================================== */

    const cadastroForm = document.querySelector('#cadastro-form form');
    const modalidadeInputs = document.querySelectorAll('.modalidade');
    const cpfInput = document.getElementById('cpf');
    const dataNascimentoField = document.querySelector('.alternativeField:nth-child(3)');
    const descricaoProjetoField = document.querySelector('.alternativeField:nth-child(4)'); 
    
    // Função para alternar campos entre Colaborador (Pessoa Física) e Apoiador (Pessoa Jurídica)
    const toggleCadastroFields = () => {
        const isColaborador = document.getElementById('modalidade1').checked;
        
        // Colaborador (Pessoa Física)
        if (isColaborador) {
            cpfInput.placeholder = "Ex: 11111111111"; // 11 dígitos
            dataNascimentoField.style.display = 'block';
            descricaoProjetoField.style.display = 'none';
        } 
        // Apoiador (Pessoa Jurídica)
        else {
            cpfInput.placeholder = "Ex: 00000000000000"; // 14 dígitos (CNPJ)
            dataNascimentoField.style.display = 'none';
            descricaoProjetoField.style.display = 'block';
        }
    };

    // Adiciona evento de mudança para os radios de modalidade
    modalidadeInputs.forEach(input => {
        input.addEventListener('change', toggleCadastroFields);
    });

    // Inicia o estado correto ao carregar a página
    if (cadastroForm) {
        // Validação Avançada
        cadastroForm.addEventListener('submit', (e) => {
            const isColaborador = document.getElementById('modalidade1').checked;
            const cpfValue = cpfInput.value.replace(/\D/g, ''); // Limpa caracteres

            let isValid = true;
            let errorMessage = '';

            // Verifica o tamanho do CPF/CNPJ
            if (isColaborador && cpfValue.length !== 11) {
                isValid = false;
                errorMessage = 'CPF inválido. Deve conter 11 dígitos.';
            } else if (!isColaborador && cpfValue.length !== 14) {
                isValid = false;
                errorMessage = 'CNPJ inválido. Deve conter 14 dígitos.';
            }
            
            // Aqui você adicionaria uma biblioteca de validação real para CPF/CNPJ

            if (!isValid) {
                e.preventDefault();
                alert(`Erro de Validação: ${errorMessage}`); // Feedback simples de erro
                
                // Implementação do feedback visual (Requisito)
                cpfInput.classList.add('is-invalid'); // Adiciona classe visual de erro
                cpfInput.setCustomValidity(errorMessage);
                
                // Remove a classe após o usuário tentar corrigir (opcional, para melhor UX)
                cpfInput.addEventListener('input', () => {
                    cpfInput.classList.remove('is-invalid');
                    cpfInput.setCustomValidity('');
                }, { once: true });
            } else {
                console.log("Formulário de Cadastro enviado e validado!");
                // Aqui você faria o envio real dos dados
                // Se tudo estiver OK, o formulário envia normalmente.
            }
        });
        
        // Chama a função ao carregar a página para definir o estado inicial
        toggleCadastroFields();
    }


    /* ====================================================== */
    /* 4. MODO ESCURO / ACESSIBILIDADE WCAG (PARTE 4)         */
    /* ====================================================== */
    const themeToggle = document.getElementById('theme-toggle'); 
    const body = document.body;

    if (themeToggle) {
        // 1. Carrega a preferência salva ao iniciar
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
        }

        // 2. Adiciona o evento de clique para alternar o modo escuro
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            // 3. Salva a nova preferência
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }
});
