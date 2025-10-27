document.addEventListener("DOMContentLoaded", () => {
  const openModal = document.getElementById("openModal");
  const closeModal = document.getElementById("closeModal");
  const okayBtn = document.getElementById("okayBtn");
  const modal = document.getElementById("modal");

  openModal.addEventListener("click", () => {
    modal.style.display = "flex";
  });
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  okayBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});
