
/**
 * TABLE VIEW - STUDENTS IMPLEMENT
 * Display data in sortable rows - good for scanning specific information
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

function showTable(data) {
  
  const sorted = [...data].sort(
    (a, b) => new Date(b.inspection_date) - new Date(a.inspection_date)
  );

  const rowsHTML = sorted
    .map(
      (inspection) => `
        <tr>
          <th scope="row">${inspection.name}</th>
          <td>${orNotListed(inspection.category)}</td>
          <td>${orNotListed(inspection.city)}</td>
          <td>${formatDate(inspection.inspection_date)}</td>
          <td>${orNotListed(inspection.inspection_results)}</td>
          <td>${countViolations(inspection)}</td>
        </tr>`
    )
    .join('');

  return `
    <h2 class="view-title">📊 Table View</h2>
    <p class="view-description">For an inspector scanning for places with the most problems</p>
    <div class="table-wrapper">
      <table class="restaurant-table">
        <caption>Food safety inspections in Prince George's County, ordered in time(newest first), and with the number of checks each place failed</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">City</th>
            <th scope="col">Inspected</th>
            <th scope="col">Result</th>
            <th scope="col">Checks out of compliance</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>
    </div>
  `;
}

export default showTable;