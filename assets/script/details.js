document.addEventListener("DOMContentLoaded", () => {
  const allDetails = document.querySelectorAll(".custom-details");

  allDetails.forEach((detail, index) => {
    const summary = detail.querySelector(".summary");

    // Abertura automática com efeito (delay variável para visual mais legal)
    setTimeout(() => {
      detail.classList.add("open");
    }, 100 + index * 200); // delay em cascata (100ms, 300ms, 500ms...)

    // Clique para abrir/fechar com animação
    summary.addEventListener("click", () => {
      detail.classList.toggle("open");
    });
  });
});
