/**
 * CHARTS VIEW - STUDENTS IMPLEMENT
 * Show patterns in your data as charts, using Chart.js
 *
 * This view has two parts:
 *   showCharts(data) returns the HTML: one <canvas> per chart, with a text alternative under each
 *   drawCharts(data) runs after that HTML is on the page, and draws a chart into each <canvas>
 *
 * Chart.js docs: https://www.chartjs.org/docs/latest/getting-started/
 */

function orNotListed(value) {
  return value === '------' || value === 'N/A' || value === undefined ? 'Not listed' : value;
}

function countViolations(inspection) {
  return Object.values(inspection).filter((value) => value === 'Out of Compliance').length;
}

function countByResult(data) {
  const counts = {};
  data.forEach((inspection) => {
    const key = orNotListed(inspection.inspection_results);
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

function averageViolationsByCategory(data) {
  const groups = {};
  data.forEach((inspection) => {
    const key = orNotListed(inspection.category);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(countViolations(inspection));
  });

  return Object.entries(groups)
    .filter(([name, violations]) => violations.length >= 5)
    .map(([name, violations]) => ({
      name: name,
      average: violations.reduce((sum, n) => sum + n, 0) / violations.length,
    }))
    .sort((a, b) => b.average - a.average);
}

function showCharts(data) {
  const counts = countByResult(data);
  const notListed = counts['Not listed'] || 0;
  const [topResult, topResultCount] = Object.entries(counts)
    .filter(([label]) => label !== 'Not listed')
    .sort((a, b) => b[1] - a[1])[0];

  const categories = averageViolationsByCategory(data);
  const worst = categories[0];

  /*html*/
  return `
    <h2 class="view-title">📈 Charts View</h2>
    <p class="view-description">For a reporter looking for patterns: how are inspection results distributed, and which types of business fail the most checks</p>
    <div class="charts-grid">
      <figure class="chart-figure">
        <canvas id="chart-one"></canvas>
        <figcaption class="chart-summary">
          ${notListed} of ${data.length} inspections have no result listed. Among the rest, the most common result was
          "${topResult}" (${topResultCount} inspections).
        </figcaption>
      </figure>
      <figure class="chart-figure">
        <canvas id="chart-two"></canvas>
        <figcaption class="chart-summary">
          ${worst.name} had the highest average, ${worst.average.toFixed(2)} checks out of compliance per inspection
          (only business types with at least 5 inspections are shown).
        </figcaption>
      </figure>
    </div>
  `;
}

function drawCharts(data) {
  if (typeof Chart === 'undefined') {
    document.querySelector('.charts-grid').innerHTML =
      '<p class="error">Chart.js did not load, so the charts can\'t be drawn. Check the &lt;script&gt; tag in index.html.</p>';
    return;
  }

  // ---- Chart 1 ----
  const counts = countByResult(data);
  const resultLabels = Object.keys(counts);
  const resultNumbers = Object.values(counts);
  const colors = ['#48a1ce', '#5ad376', '#ffd864', '#ff96a1', '#b599e8', '#f8b279', '#66d0c2', '#c5cace'];

  new Chart(document.querySelector('#chart-one'), {
    type: 'pie',
    data: {
      labels: resultLabels,
      datasets: [{ label: 'Inspections', data: resultNumbers, backgroundColor: colors }],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Inspection results' },
        legend: { position: 'bottom' },
      },
    },
  });

  // ---- Chart 2 ----
  const categories = averageViolationsByCategory(data);
  const categoryLabels = categories.map((c) => c.name);
  const categoryNumbers = categories.map((c) => Number(c.average.toFixed(2)));

  new Chart(document.querySelector('#chart-two'), {
    type: 'bar',
    data: {
      labels: categoryLabels,
      datasets: [
        { label: 'Average checks out of compliance', 
          data: categoryNumbers, 
          barPercentage: 0.7,
          categoryPercentage: 0.8,
          backgroundColor: '#327ec2' },
      ],
    },
    options: {
      indexAxis: 'y',
      aspectRatio: 1,
      plugins: {
        title: { display: true, text: 'Average failed checks by type of business' },
        legend: { display: false },
      },
      scales: {
        x: { title: { display: true, text: 'Average checks out of compliance per inspection' }, beginAtZero: true },
        y: { title: { display: true, text: 'Type of business' } },
      },
    },
  });
}

export { showCharts, drawCharts };