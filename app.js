
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.filters__buttons button');
    const cards = document.querySelectorAll('.film-card');
    const searchInput = document.getElementById('search');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            cards.forEach(card => {
                card.style.display = (filter === 'all' || card.dataset.genre === filter) ? 'block' : 'none';
            });
        });
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = title.includes(query) ? 'block' : 'none';
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filters__btn");
  const cards = document.querySelectorAll(".card");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // retirer la classe active des autres boutons
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === "all" || card.dataset.category === filter) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});