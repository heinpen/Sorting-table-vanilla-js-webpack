'use strict';

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
  return firebase.database().ref('/').once('value');
}

const properDataOrder = ['place', 'name', 'firingRate', 'score'],
  properHeaderTitleOrder = ['Place', 'Name', 'Firing Rate', 'Score'];
let data;
databaseInit()
  .then((answer) => {
    data = answer.val();
  })
  .then(function renderTable() {
    // set default sort dirrection and by what we sort(sortBy)
    let sortDir = 'up',
      sortBy = 'place';
    createTable();
    createNodes(sort(sortBy, data, sortDir));
    addListeners();
  });

// create table
function createTable() {
  // find table container
  let tableContainer = document.querySelector('#sort-table-container');

  // create element table
  const table = document.createElement('table');
  table.classList.add('sort-table');

  // create element table-head and append it inside table
  const tableHead = document.createElement('thead');
  tableHead.classList.add('sort-table__head');
  table.append(tableHead);

  // create element table-header and append it inside table-head
  const tableHeader = document.createElement('tr');
  tableHeader.classList.add('sort-table__header', 'sort-table__row');
  tableHead.append(tableHeader);

  // create loop to iterate over object properties to create table-header
  properDataOrder.forEach((name, i) => {
    // create header-cell and append it inside table-header
    const headerCell = document.createElement('th');
    headerCell.classList.add('sort-table__title-cell', `sort-table__${name}-title`);
    headerCell.id = `${name}`;
    headerCell.setAttribute('tabindex', '0');
    headerCell.innerHTML = `${properHeaderTitleOrder[i]}`;
    tableHeader.append(headerCell);
  });

  // create table body and append it inside table
  const tableBody = document.createElement('tbody');
  tableBody.classList.add('sort-table__body');
  table.append(tableBody);

  // and append table to DOM
  tableContainer.append(table);
}

function sort(sortBy, data, dir) {
  // create dataset attribute in title cell with dataset property and set dirrection by which sort
  document.querySelector(`.sort-table__${sortBy}-title`).dataset.sorted = `${dir}Sorted`;

  // create two arrays
  const sortData = [],
    sortArray = [];

  // find all sortBy properties of each object in data array and push it to sortedArray
  for (let i = 0; i < data.length; i++) {
    sortArray.push(data[i][sortBy]);
  }

  // check dirrection of sorting and sort sortArray according to outcome in if statement
  // for names
  if (sortBy === 'name' && dir === 'up') {
    if (dir === 'up') {
      sortArray.sort();
    } else {
      sortArray.reverse();
    }
    // for anything else
  } else if (sortBy !== 'name' && dir === 'down') {
    sortArray.sort(function sorting(a, b) {
      return b - a;
    });
  } else {
    sortArray.sort(function sorting(a, b) {
      return a - b;
    });
  }

  // every iteretion through sortArray look for value(in data) to match corresponding value in sortArray
  sortArray.forEach(function createSortedData(value) {
    for (let i = 0; i < data.length; i++) {
      if (data[i][sortBy] === value) {
        sortData.push(data[i]);
      }
    }
  });

  // return new sorted data
  return sortData;
}

function recreateNodes(sortBy, data, dir) {
  document.querySelector('.sort-table__body').innerHTML = '';
  createNodes(sort(sortBy, data, dir));
}

// based on new sorted data create cells of table
function createNodes(newData) {
  const mainFragment = document.createDocumentFragment(),
    cellFragment = document.createDocumentFragment();

  for (let person of newData) {
    const row = createRow();

    properDataOrder.forEach((value) => {
      const cell = createCell(value, person[value]);
      cellFragment.append(cell);
    });

    row.append(cellFragment);
    mainFragment.append(row);
  }

  document.querySelector('.sort-table__body').append(mainFragment);
}

function createRow() {
  const row = document.createElement('tr');
  row.classList.add('sort-table__row');
  return row;
}

function createCell(key, prop) {
  const cell = document.createElement('td');
  // create class for cell using name of key
  cell.classList.add(`sort-table__${key}`);
  cell.classList.add('sort-table__cell');
  cell.innerHTML = `${prop}`;
  return cell;
}

function enableSorting(e) {
  // check pressed key
  if (e.code !== undefined && e.code !== 'Enter') {
    return;
  }

  if (e.target.id) {
    // create variable in wich store value from dataset attribute
    const atrSorted = document.querySelector(`.sort-table__${e.target.id}-title`).dataset.sorted;
    let dirrection;

    // change dirrection to the opposite of atrSorted(toggle dirrection)
    // and call recreateNodes function with parameters due to where user click
    if (atrSorted) {
      if (atrSorted === 'upSorted') {
        dirrection = 'down';
        recreateNodes(e.target.id, data, dirrection);
      } else {
        dirrection = 'up';
        recreateNodes(e.target.id, data, dirrection);
      }
    } else {
      dirrection = 'up';
      recreateNodes(e.target.id, data, dirrection);
    }
  }
}

function addListeners() {
  const tableHeader = document.querySelector('.sort-table__header'),
    input = document.querySelector('#my-input');
  // set event listener to the head of the table
  tableHeader.addEventListener('click', enableSorting);
  tableHeader.addEventListener('keydown', enableSorting);

  // set event listener to input to triger function each time user enters something in field
  input.addEventListener('keyup', function searchByName() {
    // transform what user enters to upper case
    const listOfNames = document.querySelectorAll('.sort-table__name'),
      char = input.value.toUpperCase();

    for (let i = 0; i < listOfNames.length; i++) {
      // and check if characters match by transform to upper case as well
      if (listOfNames[i].innerHTML.toUpperCase().indexOf(char) !== 0) {
        listOfNames[i].parentElement.style.display = 'none';
      } else {
        listOfNames[i].parentElement.style.display = 'table-row';
      }
    }
  });
}
