const fs = require('fs');

function calculateChildSizes(node, nodeParts) {
  if (!node.children || node.children.length === 0) {
    if (node.uid && nodeParts[node.uid]) {
      return nodeParts[node.uid].renderedLength;
    }
    return 0;
  }

  return node.children.reduce((sum, child) => {
    return sum + calculateChildSizes(child, nodeParts);
  }, 0);
}

function extractSizes(json) {
  const nodeParts = json.nodeParts;
  const results = [];

  function traverse(node) {
    if (node.name) {
      const size = calculateChildSizes(node, nodeParts);
      results.push({ name: node.name, size });
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  }

  traverse(json.tree);

  const topThree = results.sort((a, b) => b.size - a.size).slice(0, 10);

  console.log('Top 10 Biggest Children:', topThree);
}

const jsonFile = './bundle.json';
const jsonData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

extractSizes(jsonData);
