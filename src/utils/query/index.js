const DocumentReference = require('../../firebase/firestore/document-reference');
const DocumentSnapshot = require('../../firebase/firestore/document-snapshot');
const QuerySnapshot = require('../../firebase/firestore/query-snapshot');

function endAt(data, prop, value) {
  return filterByCursor(data, prop, value, 'endAt');
}

function endBefore(data, prop, value) {
  return filterByCursor(data, prop, value, 'endBefore');
}

function limit(data, threshold) {
  const filteredData = {};
  const ids = Object.keys(data).slice(0, threshold);

  for (const id of ids) {
    filteredData[id] = data[id];
  }

  return filteredData;
}

function orderBy(data, key, order) {
  const filteredData = {};
  let ids;

  if (order === 'desc') {
    ids = Object.keys(data).slice().sort((a, b) => {
      if (typeof data[a][key] === 'number') {
        return data[b][key] - data[a][key];
      } else {
        if (data[a][key] > data[b][key]) {
          return -1;
        } else if (data[a][key] < data[b][key]) {
          return 1;
        } else {
          return 0;
        }
      }
    });
  } else {
    ids = Object.keys(data).slice().sort((a, b) => {
      if (typeof data[a][key] === 'number') {
        return data[a][key] - data[b][key];
      } else {
        if (data[a][key] < data[b][key]) {
          return -1;
        } else if (data[a][key] > data[b][key]) {
          return 1;
        } else {
          return 0;
        }
      }
    });
  }

  for (const id of ids) {
    filteredData[id] = data[id];
  }

  return filteredData;
}

function startAfter(data, prop, value) {
  return filterByCursor(data, prop, value, 'startAfter');
}

function startAt(data, prop, value) {
  return filterByCursor(data, prop, value, 'startAt');
}

function where(data = {}, key, operator, value) {
  const filteredData = {};
  const ids = Object.keys(data).filter((id) => {
    if (operator === '<') {
      return data[id][key] < value;
    } else if (operator === '<=') {
      return data[id][key] <= value;
    } else if (operator === '==') {
      if (value instanceof DocumentReference) {
        return (
          data[id][key]
          && data[id][key].startsWith('__ref__:')
          && data[id][key] === buildPathFromRef(value)
        );
      }

      return data[id][key] === value;
    } else if (operator === '>=') {
      return data[id][key] >= value;
    } else if (operator === '>') {
      return data[id][key] > value;
    }
  });

  for (const id of ids) {
    filteredData[id] = data[id];
  }

  return filteredData;
}

function querySnapshot(data, collection) {
  const documentSnapshots = [];

  if (data) {
    for (const key in data.__doc__) {
      if (data.__doc__.hasOwnProperty(key)) {
        const documentRecord = data['__doc__'][key];
        const documentReference = new DocumentReference(
          key,
          documentRecord,
          collection,
          collection.firestore
        );
        const documentSnapshot = new DocumentSnapshot(
          key,
          documentRecord,
          documentReference
        );

        documentSnapshots.push(documentSnapshot);
      }
    }
  }

  const querySnapshot = new QuerySnapshot(documentSnapshots);

  return querySnapshot;
}

function filterByCursor(data, prop, value, cursor) {
  const filteredData = {};
  const ids = Object.keys(data).filter((id) => {
    if (cursor === 'endAt') {
      return data[id][prop] <= value;
    } else if (cursor === 'endBefore') {
      return data[id][prop] < value;
    } else if (cursor === 'startAfter') {
      return data[id][prop] > value;
    } else if (cursor === 'startAt') {
      return data[id][prop] >= value;
    }
  });

  for (const id of ids) {
    filteredData[id] = data[id];
  }

  return filteredData;
}

function buildPathFromRef(ref) {
  let url = '';
  let currentRef = ref;
  let hasParentRef = true;

  while (hasParentRef) {
    url = `${currentRef.id}/${url}`;

    if (!currentRef.parent) {
      hasParentRef = false;
    }

    currentRef = currentRef.parent;
  }

  return `__ref__:${url.slice(0, -1)}`;
}

module.exports = {
  endAt,
  endBefore,
  limit,
  orderBy,
  querySnapshot,
  startAfter,
  startAt,
  where,
};
