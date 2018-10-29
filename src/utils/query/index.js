import { buildPathFromReference } from '../path';
import DocumentReference from '../../firebase/firestore/document-reference';
import DocumentSnapshot from '../../firebase/firestore/document-snapshot';
import QuerySnapshot from '../../firebase/firestore/query-snapshot';

function filterByCursor(data, prop, value, cursor) {
  const filteredData = {};
  const ids = Object.keys(data).filter((id) => {
    if (cursor === 'endAt') {
      return data[id][prop] <= value;
    } if (cursor === 'endBefore') {
      return data[id][prop] < value;
    } if (cursor === 'startAfter') {
      return data[id][prop] > value;
    }

    return data[id][prop] >= value;
  });

  for (const id of ids) {
    filteredData[id] = data[id];
  }

  return filteredData;
}

function getPathValue(data, field) {
  const keys = field.split('.');
  let pathValue;

  keys.forEach((key) => {
    if (pathValue) {
      pathValue = pathValue[key];
    } else {
      pathValue = data[key];
    }
  });

  return pathValue;
}

export function endAt(data, prop, value) {
  return filterByCursor(data, prop, value, 'endAt');
}

export function endBefore(data, prop, value) {
  return filterByCursor(data, prop, value, 'endBefore');
}

export function limit(data, threshold) {
  const filteredData = {};
  const ids = Object.keys(data).slice(0, threshold);

  for (const id of ids) {
    filteredData[id] = data[id];
  }

  return filteredData;
}

export function orderBy(data, key, order) {
  const filteredData = {};
  let ids;

  if (order === 'desc') {
    ids = Object.keys(data).slice().sort((a, b) => {
      if (typeof data[a][key] === 'number') {
        return data[b][key] - data[a][key];
      }
      if (data[a][key] > data[b][key]) {
        return -1;
      } if (data[a][key] < data[b][key]) {
        return 1;
      }

      return 0;
    });
  } else {
    ids = Object.keys(data).slice().sort((a, b) => {
      if (typeof data[a][key] === 'number') {
        return data[a][key] - data[b][key];
      }
      if (data[a][key] < data[b][key]) {
        return -1;
      } if (data[a][key] > data[b][key]) {
        return 1;
      }

      return 0;
    });
  }

  for (const id of ids) {
    filteredData[id] = data[id];
  }

  return filteredData;
}

export function startAfter(data, prop, value) {
  return filterByCursor(data, prop, value, 'startAfter');
}

export function startAt(data, prop, value) {
  return filterByCursor(data, prop, value, 'startAt');
}

export function where(data = {}, key, operator, value) {
  const filteredData = {};
  const ids = Object.keys(data).filter((id) => {
    // Allow us to handle nested values
    const pathValue = getPathValue(data[id], key);

    if (operator === '<') {
      return pathValue < value;
    } if (operator === '<=') {
      return pathValue <= value;
    } if (operator === '==') {
      if (value instanceof DocumentReference) {
        return (
          pathValue
          && pathValue.startsWith('__ref__:')
          && pathValue === buildPathFromReference(value)
        );
      }

      return pathValue === value;
    } if (operator === '>=') {
      return pathValue >= value;
    } if (operator === 'array-contains') {
      return pathValue.find(item => item === value);
    }

    return pathValue > value;
  });

  for (const id of ids) {
    filteredData[id] = data[id];
  }

  return filteredData;
}

export function querySnapshot(data, collection) {
  const documentSnapshots = [];

  if (data && Object.prototype.hasOwnProperty.call(data, '__doc__')) {
    for (const key of Object.keys(data.__doc__)) {
      const documentRecord = data.__doc__[key];

      if (!documentRecord.__isDeleted__ && !documentRecord.__isDirty__) {
        const documentReference = new DocumentReference(
          key,
          documentRecord,
          collection,
          collection.firestore,
        );
        const documentSnapshot = new DocumentSnapshot(
          key,
          documentRecord,
          documentReference,
        );

        documentSnapshots.push(documentSnapshot);
      }
    }
  }

  const snapshot = new QuerySnapshot(documentSnapshots);

  return snapshot;
}
