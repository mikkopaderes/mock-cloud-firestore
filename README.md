# mock-cloud-firestore

Mock library for Cloud Firestore

## Installation

Install the library by running this command:

```bash
npm install --save-dev mock-cloud-firestore
```

### Importing

#### Browsers

Import the `mock-cloud-firestore.js` file from the `dist/browser` folder in your app

#### Node.js

Import the library by using `require('mock-cloud-firestore')`

## Usage

### `MockFirebase`

`MockFirebase` class is provided to replace your app's Firebase instance

```javascript
const firebase = new MockFirebase(fixtureData);
```

> Replacing the Firebase instance depends on how your app consumes it. As an example, you could do `window.firebase = new MockFirebase(fixtureData)` on a browser environment.

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
- `onSnapshot()` is supported but doesn't get realtime updates

> You can look into the source code to see if an API you're using is supported. I've written it in a way that you could quickly scan the APIs.

## Developing

### Installation

* `git clone <repository-url>` this repository
* `cd mock-cloud-firestore`
* `npm install`

### Running Tests

* `npm test`
