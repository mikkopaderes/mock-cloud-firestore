# mock-cloud-firestore

Mock library for Cloud Firestore

## Installation

Install the library by running this command:

```bash
npm install --save-dev mock-cloud-firestore
```

## Usage

### `MockFirebase`

`MockFirebase` class is provided to replace your app's Firebase instance

```javascript
import MockFirebase from 'mock-cloud-firstore';

const firebase = new MockFirebase(fixtureData);
```

> Replacing the Firebase instance depends on how your app is structured. As an example, you could do `window.firebase = new MockFirebase(fixtureData)`.

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
                user_b: {}
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
                user_a: {}
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

In the example above, your `MockFirebase` would have

- `users` collection
- `user_a`, `user_b`, and `user_c` documents under `users` collection
- `friends` subcollection under `user_a` and `user_b` documents

## Caveats

Not all APIs are supported. Here are some unsupported major ones

- Transaction
- `onSnapshot()` is supported by doesn't get realtime updates

> You can look into the source code to see if an API you're using is supported. I've written it in a way that you could quickly scan the APIs.

## Developing

### Installation

* `git clone <repository-url>` this repository
* `cd mock-cloud-firestore`
* `npm install`

### Running Tests

* `npm test`
