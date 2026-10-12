# Rifa Beneficente - Jonas 🎟️

Um gerador simples e prático de cartelas digitais para a Rifa Solidária do Jonas. Este projeto web foi criado para facilitar a arrecadação de fundos destinados à compra de medicamentos e alimentos durante a hospitalização do Jonas. 

O sistema gera automaticamente imagens no formato vertical (1080x1920) otimizadas para postagem no **Instagram Stories** e **WhatsApp Status**.

## 🚀 Funcionalidades

* **Geração Automática:** Cria múltiplas cartelas dividindo o total de números (ex: 200) em blocos fáceis de ler.
* **Marcação de Vendidos:** Risca visualmente os números que já foram comprados.
* **Personalização de Imagem:** Permite fazer upload da foto do Jonas diretamente na página, com controles deslizantes para ajustar o enquadramento.
* **Múltiplos Recebedores:** Suporta a configuração de chaves PIX diferentes dependendo da numeração da cartela.
* **Exportação Simples:** Um botão "Baixar imagem" abaixo de cada cartela utiliza a biblioteca `html2canvas` para gerar e baixar um arquivo `.png` pronto para compartilhamento.

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estruturação semântica.
* **CSS3:** Estilização com variáveis e layout responsivo/adaptável.
* **JavaScript (Vanilla):** Lógica de geração das cartelas, manipulação de imagem e exportação.
* **html2canvas:** Biblioteca externa usada para "tirar o print" das cartelas e gerar o arquivo de imagem.

## ⚙️ Como usar e configurar

Não é necessário instalar nada. Basta ter os arquivos no seu computador e dar um duplo clique no arquivo `index.html` para abri-lo no seu navegador.

### Ajustando as configurações (script.js)

Para atualizar a rifa (marcar números vendidos, mudar prêmios ou chaves PIX), abra o arquivo `script.js` (ou a tag `<script>` no seu HTML) e edite o objeto de configuração `C`:

```javascript
const C = {
  total: 200, 
  valor: "R$ 10,00",
  
  // Configure os intervalos de números por cartela
  faixas: [[1,20],[21,40], [41,60], [61,80], [81,100]],
  
  // Lista de prêmios
  premios: [
    "Jogo de xícaras com pires",
    "Mesa de cabeceira suspensa",
    // ... adicione ou remova prêmios aqui
  ],
  
  // Configuração de quem recebe o PIX de acordo com o número
  pix: [
    {ate:20,  nome:"Selma",    chave:"(85) 99213-5195"},
    {ate:40,  nome:"Pedro",    chave:"(85) 99278-6616"},
    // ...
  ],
  
  // NÚMEROS VENDIDOS: adicione aqui os números que já foram pagos
  // Exemplo: se vendeu o 5, 12 e 45, deixe assim: [5, 12, 45]
  vendidos: [] 
};
```

## 📸 Adicionando a foto

Ao abrir a página, clique no botão "Adicionar foto do Jonas (opcional)".

Selecione a imagem sem fundo que você gerou.

Os controles de enquadramento (Preencher quadro, ↔ Horizontal e ↕ Vertical) aparecerão magicamente para você ajustar a foto perfeitamente dentro do card.

## 🤝 Como contribuir

Este é um projeto de causa nobre. Sinta-se à vontade para modificar o código, melhorar o design ou adaptar para outras campanhas beneficentes que precisem de uma ferramenta semelhante.