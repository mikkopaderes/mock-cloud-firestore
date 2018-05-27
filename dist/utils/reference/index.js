const { buildPathFromReference } = require('../path');

function validateReference(ref, type) {
  const path = buildPathFromReference(ref).substr(8);
  const pathNodes = path.split('/');

  if (type === 'collection' && pathNodes.length % 2 !== 1) {
    throw new Error(`Invalid collection reference. Collection references must have an odd number of segments, but ${path} has ${pathNodes.length}`);
  } else if (type === 'doc' && pathNodes.length % 2 !== 0) {
    throw new Error(`Invalid document reference. Document references must have an even number of segments, but ${path} has ${pathNodes.length}`);
  }
}

module.exports = { validateReference };