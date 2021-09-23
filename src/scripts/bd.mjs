'use strict';
import { createTable } from './createTable.mjs';
import {createNodes} from './createTable.mjs'
import {sort} from './createTable.mjs'
import {addListeners} from './createTable.mjs'

// connect to firebase database
const firebaseConfig = {
  apiKey: 'AIzaSyBVeT3JuMqOgvP8joNaKclC5ykbt1ybL0E',
  authDomain: 'sorting-table-fd4a3.firebaseapp.com',
  databaseURL: 'https://sorting-table-fd4a3-default-rtdb.firebaseio.com',
  projectId: 'sorting-table-fd4a3',
  storageBucket: 'sorting-table-fd4a3.appspot.com',
  messagingSenderId: '368922558232',
  appId: '1:368922558232:web:1b28fb6537a1fb4e9e686d',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function databaseInit() {
  return firebase.database()
  .ref('/')
  .once('value');
}

export const properDataOrder = ['place', 'name', 'firingRate', 'score'];
export const properHeaderTitleOrder = ['Place', 'Name', 'Firing Rate', 'Score'];

let data;
databaseInit()
.then((answer) => {
  data = answer.val();
})
.then(function renderTable() {
  // set default sort direction and by what we sort(sortBy)
  const sortDir = 'up';
  const sortBy = 'place';
  createTable();
  createNodes(sort(sortBy, data, sortDir));
  addListeners(data);
});

