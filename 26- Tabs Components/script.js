(function () {
  const tablist = document.getElementById("demoTablist");
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const panels = tabs.map((t) => 
    document.getElementById(t.getAttribute("aria-controls")));

  // Helper function

  function activateTab(newIndex, setFocus = true) {
    tabs.forEach((t, i) => {
      const selected = i === newIndex;
      t.classList.toggle("active", selected);
      t.setAttribute("aria-selected", selected ? "true" : "false");
      t.tabIndex = selected ? 0 : -1;

      panels[i].hidden = !selected;
      panels[i].classList.toggle("active",selected);

      if (selected && setFocus) {
        t.focus({ preventScroll: true });
      }
    });
  }

  //   Click Behavior

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", (e) => {
      activateTab(i, false);
    });

    // Keyboard

    tab.addEventListener("keydown", (e) => {
      const key = e.key;
      let newIndex = null;

      if (key === "ArrowRight" || key === "ArrowDown") {
        newIndex = (i + 1) % tabs.length;
        e.preventDefault();
      } else if (key === "ArrowLeft" || key === "ArrowUp") {
        newIndex = (i - 1 + tabs.length) % tabs.length;
        e.preventDefault();
      } else if (key === "Home") {
        newIndex = 0;
        e.preventDefault();
      } else if (key === "End") {
        newIndex = tabs.length - 1;
        e.preventDefault();
      }
      if (newIndex !== null) activateTab(newIndex);
    });

    // Ensure panel have role attributes set ( defensive)
    const panel = panels[i];
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("tabindex", "0");
  });

  // Initialize first tab active
  activateTab(0, false);

  //   Optional : Deep-link via hash ( #panel-3)
  function checkHash() {
    const id = location.hash.replace("#", "");

    if (!id) return;
    const index = panels.findIndex((p) => p.id === id);

    if (index >= 0) activateTab(index, false);
  }

  window.addEventListener("hashchange", checkHash);
  checkHash();
})();

