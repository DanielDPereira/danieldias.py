# danieldias.py

Portfólio pessoal com dados carregados via JSON e renderização dinâmica no frontend.

## Estrutura organizada

### JavaScript (`script/`)

- `main.js`: ponto de entrada da aplicação
- `config/`: constantes globais
- `services/`: acesso e carregamento de dados
- `utils/`: funções utilitárias reutilizáveis
- `ui/`: módulos por seção/componente da interface

### CSS (`style/`)

- `style.css`: agregador principal com `@import`
- `base/`: variáveis e reset
- `layout/`: estrutura global (header, footer, containers)
- `components/`: componentes reutilizáveis (UI e modal)
- `sections/`: estilos por seção da página
- `utilities/`: animações, reveal e scrollbar
- `responsive/`: media queries

## Executar localmente

Como o projeto usa `fetch` para carregar `portfolio-data.json`, rode em servidor local:

```powershell
python -m http.server 8000
```

Depois abra no navegador:

`http://localhost:8000`