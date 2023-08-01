function filterWithMaxResults(rows, predicate, maxResults) {
  const results = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (predicate(row)) {
      results.push(row);
    }

    if (maxResults !== undefined && results.length > maxResults) {
      return {
        maxResultsExceeded: true,
        results: results.slice(0, maxResults)
      };
    }
  }
  return {
    maxResultsExceeded: false,
    results
  };
}

module.exports = { filterWithMaxResults };
