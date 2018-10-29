# mock-cloud-firestore

Mock library for Cloud Firestore

## Installation

Assuming that you're using [npm](https://www.npmjs.com/) as your package manager:

```
npm install --save-dev mock-cloud-firestore
```

If you're not using any module bundler, you can use the precompiled [UMD](https://github.com/umdjs/umd) builds in the `dist` folder. For this build, `MockFirebase` would be available as a `window.MockFirebase` global variable. You can download the files at [unpkg](https://unpkg.com/mock-cloud-firestore/).

## API

### `MockFirebase`

This accepts the following option:

- `isNaiveSnapshotListenerEnabled` - When true, changes to **any** data would cause the `onSnapshot()` to fire. Otherwise, `onSnapshot()` won't get realtime updates.

#### Params:

| Name        | Type   | Attributes | Description |
| ----------- | -------| ---------- | ----------- |
| fixtureData | Object |            |             |
| option      | Object | optional   |             |

## Usage

You'll need to replace the Firebase instance that you're app is using. That would depend on how you use it. Below are some sample use-cases:

**Example 1 - Overriding the Firebase global variable**

```javascript
import MockFirebase from 'mock-cloud-firestore';

window.firebase = new MockFirebase(fixtureData);

const db = firebase.firestore();

db.collection('users').add({ ... });
```

**Example 2 - Dependency injection**

```javascript
import MockFirebase from 'mock-cloud-firestore';

function addUser(firebase) {
  return firebase.firestore.collection('users').add({ ... });
}

const firebase = new MockFirebase(fixtureData);

addUser(firebase);
```

### Fixture Data

Here's a sample fixture data

```javascript
const fixtureData = {
  __collection__: {
    users: {
      __doc__: {
        user_a: {
          age: 15,
          username: 'user_a',

          __collection__: {
            friends: {
              __doc__: {
                user_b: {
                  reference: '__ref__:users/user_b'
                }
              }
            }
          }
        },

        user_b: {
          age: 10,
          username: 'user_b',

          __collection__: {
            friends: {
              __doc__: {
                user_a: {
                  reference: '__ref__:users/user_a'
                }
              }
            }
          }
        },

        user_c: {
          age: 20,
          username: 'user_c'
        }
      }
    }
  }
}
```

Here's whats going on with the example above

- There will be a `users` collection
- There will be `user_a`, `user_b`, and `user_c` documents under `users` collection
- There will be a `friends` subcollection under `user_a` and `user_b` documents
- `__ref__:` indicates that this is a [`Reference`](https://firebase.google.com/docs/firestore/manage-data/data-types#data_types) data type to a document
  - `__ref__:users/user_a` will be equivalent to `firestore.collection('users').doc('user_a')`

## Caveats

Not all APIs are supported. Here are some unsupported major ones

- Transaction
- `onSnapshot()` is supported but doesn't get realtime updates by default.
  - A naive listener is available in that changes to **any** data would cause it to fire.

> You can look into the source code to see if an API you're using is supported. I've written it in a way that you could quickly scan the APIs.

## Developing

### Installation

* `git clone <repository-url>` this repository
* `cd mock-cloud-firestore`
* `npm install`

### Running Tests

* `npm test`
