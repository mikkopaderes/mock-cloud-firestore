---
layout: doc
title: Getting Started
category: Introduction
order: 2
cenchat:
  id: mock-cloud-firestore_docs
  text: Get help
---

## Installation

Assuming that you're using [npm](https://www.npmjs.com/) as your package manager:

```
npm install --save-dev mock-cloud-firestore
```

If you're not using any module bundler, you can use the precompiled [UMD](https://github.com/umdjs/umd) builds in the `dist` folder. For this build, `MockFirebase` would be available as a `window.MockFirebase` global variable. You can download the files at [unpkg](https://unpkg.com/mock-cloud-firestore/).

## Usage

You'll need to replace the Firebase instance that your app is using. That would depend on how you use it. Below are some sample use-cases:

### 1. Overriding the Firebase Global Variable

```javascript
import MockFirebase from 'mock-cloud-firestore';

const fixtureData = {
  __collection__: {
    users: {
      __doc__: {
        user_a: {
          age: 15,
          username: 'user_a',
        }
      }
    }
  }
};

window.firebase = new MockFirebase(fixtureData);

const db = firebase.firestore();

db.collection('users').add({ ... });
```

### 2. Dependency Injection

```javascript
import MockFirebase from 'mock-cloud-firestore';

function addUser(firebase) {
  return firebase.firestore.collection('users').add({ ... });
}

const fixtureData = {
  __collection__: {
    users: {
      __doc__: {
        user_a: {
          age: 15,
          username: 'user_a',
        }
      }
    }
  }
};
const firebase = new MockFirebase(fixtureData);

addUser(firebase);
```

---

[Next: API »](api)
