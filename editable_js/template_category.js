/**
 * CATEGORY VIEW - STUDENTS IMPLEMENT
 * Group data by categories
 */

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function orNotListed(value) {
  return value === '------' || value === 'N/A' || value === undefined ? 'Not listed' : value;
}

function countViolations(inspection) {
  return Object.values(inspection).filter((value) => value === 'Out of Compliance').length;
}


function groupByCategory(data) {
  const groups = {};
  data.forEach((inspection) => {
    const key = orNotListed(inspection.category);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(inspection);
  });
  return groups;
}

function showCategories(data) {
  const groups = groupByCategory(data);

  
  const summaries = Object.entries(groups)
    .map(([name, items]) => {
      const totalViolations = items.reduce((sum, item) => sum + countViolations(item), 0);
      return {
        name: name,
        items: items,
        count: items.length,
        average: totalViolations / items.length,
      };
    })
    .sort((a, b) => b.count - a.count);

  const sectionsHTML = summaries
    .map(
      (group) => `
        <details class="category-section">
          <summary class="category-header">
            <span>${group.name}</span>
            <span class="category-stats">
              ${group.count} inspections · avg ${group.average.toFixed(2)} checks out of compliance
            </span>
          </summary>
          <div class="category-items">
            ${group.items
              .map(
                (item) => `
              <div class="category-item">
                <span><strong>${item.name}</strong><br>${orNotListed(item.city)}</span>
                <span>${formatDate(item.inspection_date)}</span>
                <span>${countViolations(item)} out of compliance</span>
              </div>`
              )
              .join('')}
          </div>
        </details>`
    )
    .join('');

  return `
    <h2 class="view-title">📂 Category View</h2>
    <p class="view-description">To see which types of business have the most inspections</p>
    ${sectionsHTML}
  `;
}

export default showCategories;