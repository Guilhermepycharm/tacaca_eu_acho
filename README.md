# tacacá

site sobre tacacá. feito com pressa mas funciona.

## rodar local

```bash
npm install
npm start
```

abre `http://localhost:3000`

## build estático (pro netlify)

```bash
npm run build
```

gera `public/index.html`

## stack

- express + ejs
- css vanilla com custom properties
- js puro (intersection observer + parallax)
- zero framework, zero firula

## estrutura

```
views/          → templates ejs
public/         → css, js, imagens
data/           → conteúdo em json
build.js        → gera html estático
server.js       → servidor local
```
