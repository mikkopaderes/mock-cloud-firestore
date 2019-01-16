/* eslint no-use-before-define: ['error', 'nofunc'] */

import { buildPathFromReference } from '../path';
import DocumentReference from '../../firebase/firestore/document-reference';

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function isFieldValue(value) {
  return isObject(value) && Object.prototype.hasOwnProperty.call(value, '_methodName');
}

function validateValue(value, option) {
  if (isObject(value)) {
    const newOption = Object.assign({}, option, { isInObject: true });

    Object.keys(value).forEach(key => validateValue(value[key], newOption));
  }

  if (Array.isArray(value)) {
    const newOption = Object.assign({}, option, { isInArray: true });

    value.forEach(item => validateValue(item, newOption));
  }

  if (value === undefined) {
    throw new Error(`Function DocumentReference.${option.type}() called with invalid data. Unsupported field value: undefined (found in field ${option.field})`);
  }

  if (isFieldValue(value)) {
    const { _methodName: methodName } = value;

    if (methodName === 'FieldValue.delete') {
      if ((option.type === 'add' || option.type === 'set:merge-false')) {
        throw new Error(`Function DocumentReference.set() called with invalid data. FieldValue.delete() cannot be used with set() unless you pass {merge:true} (found in field ${option.field})`);
      }

      if (option.type === 'update' && option.isInObject) {
        throw new Error(`Function DocumentReference.update() called with invalid data. FieldValue.delete() can only appear at the top level of your update data (found in field ${option.field})`);
      }
    }

    if (option.isInArray) {
      throw new Error(`Function DocumentReference.${option.type}() called with invalid data. ${methodName} is not currently supported inside arrays`);
    }
  }
}

function processArrayUnion(arrayUnion, oldArray = []) {
  const newArray = [...oldArray];

  arrayUnion._elements.forEach((unionItem) => {
    if (!newArray.find(item => item === unionItem)) {
      newArray.push(unionItem);
    }
  });

  return newArray;
}

function processArrayRemove(arrayRemove, oldArray = []) {
  let newArray = [...oldArray];

  arrayRemove._elements.forEach((unionItem) => {
    newArray = newArray.filter(item => item !== unionItem);
  });

  return newArray;
}

function processFieldValue(newValue, oldValue) {
  const { _methodName: methodName } = newValue;

  if (methodName === 'FieldValue.serverTimestamp') {
    return new Date();
  }

  if (methodName === 'FieldValue.arrayUnion') {
    return processArrayUnion(newValue, oldValue);
  }

  if (methodName === 'FieldValue.arrayRemove') {
    return processArrayRemove(newValue, oldValue);
  }

  return '__FieldValue.delete__';
}

function processObject(newValue, oldValue, option) {
  if (option.type === 'set:merge-true') {
    const mergedValue = Object.assign({}, oldValue, newValue);

    Object.keys(newValue).forEach((key) => {
      const oldObjectKeyValue = isObject(oldValue) ? oldValue[key] : undefined;

      mergedValue[key] = parseValue(newValue[key], oldObjectKeyValue, option);

      if (mergedValue[key] === '__FieldValue.delete__') {
        delete mergedValue[key];
      }
    });

    return mergedValue;
  }

  const newObjectValue = Object.assign({}, newValue);

  Object.keys(newValue).forEach((key) => {
    newObjectValue[key] = parseValue(newValue[key], undefined, option);

    if (newObjectValue[key] === '__FieldValue.delete__') {
      delete newObjectValue[key];
    }
  });

  return newObjectValue;
}

export default function parseValue(newValue, oldValue, option) {
  validateValue(newValue, option);

  if (newValue instanceof DocumentReference) {
    return buildPathFromReference(newValue);
  }

  if (isFieldValue(newValue)) {
    return processFieldValue(newValue, oldValue);
  }

  if (isObject(newValue)) {
    return processObject(newValue, oldValue, option);
  }

  return newValue;
}
