function buildPathFromReference(ref) {
  let url = '';
  let currentRef = ref;
  let hasParentRef = true;

  while (hasParentRef) {
    if (currentRef.id) {
      url = `${currentRef.id}/${url}`;

      if (!currentRef.parent) {
        hasParentRef = false;
      }

      currentRef = currentRef.parent;
    } else {
      break;
    }
  }

  return `__ref__:${url.slice(0, -1)}`;
}

function cleanPath(path) {
  if (path.startsWith('/')) {
    // Remove staring slash
    return path.substr(1);
  }

  return path;
}

function validatePath(path) {
  if (path.includes('//')) {
    throw new Error(`Invalid path (${path}). Paths must not contain // in them.`);
  }
}

module.exports = { buildPathFromReference, cleanPath, validatePath };