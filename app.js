const app = document.getElementById("app");

fetch("https://raw.githubusercontent.com/openai/sandbox/main/sample_player_data.json")
  .then(res => res.json())
  .then(data => {
    const state = { selected: [] };

    const calcAvg = (key) => {
      const filtered = data.filter(p => state.selected.includes(p.number) && !isNaN(parseFloat(p[key])));
      if (filtered.length === 0) return "N/A";
      const total = filtered.reduce((sum, p) => sum + parseFloat(p[key]), 0);
      return (total / filtered.length).toFixed(3);
    };

    const render = () => {
      app.innerHTML = `
        <h1 class="text-2xl font-bold text-center mb-4">出賽球員篩選</h1>
        <div class="text-center mb-4">
          <p>平均打擊率：${calcAvg("avg")}</p>
          <p>平均長打率：${calcAvg("lng")}</p>
          <p>平均上壘率：${calcAvg("base")}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          ${data.map(p => `
            <div class="border rounded p-4 cursor-pointer ${state.selected.includes(p.number) ? 'bg-blue-100' : ''}"
                 onclick="toggleSelection('${p.number}')">
              <h2 class="text-lg font-semibold">#${p.number} ${p.name}</h2>
              <p>打擊率：${p.avg}</p>
              <p>長打率：${p.lng}</p>
              <p>上壘率：${p.base}</p>
            </div>
          `).join('')}
        </div>
        <div class="text-center">
          <button onclick="copyList()" class="px-4 py-2 bg-blue-500 text-white rounded">複製出賽名單</button>
        </div>
      `;
    };

    window.toggleSelection = (number) => {
      state.selected = state.selected.includes(number)
        ? state.selected.filter(n => n !== number)
        : [...state.selected, number];
      render();
    };

    window.copyList = () => {
      const result = data
        .filter(p => state.selected.includes(p.number))
        .map(p => `#${p.number} ${p.name}`)
        .join("\n");
      navigator.clipboard.writeText(result);
      alert("已複製出賽名單\n\n" + result);
    };

    render();
  });
