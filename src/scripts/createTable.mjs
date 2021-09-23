'use strict';
import {properDataOrder} from './bd.mjs';
import {properHeaderTitleOrder} from './bd.mjs';

// create table
export function createTable() {
  // find table container
  const tableContainer = document.querySelector('#sort-table-container');

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

export function sort(sortBy, content, dir) {
  // Create dataset attribute in title cell with dataset property
  // and set direction by which sort.
  document.querySelector(`.sort-table__${sortBy}-title`).dataset.sorted = `${dir}Sorted`;

  // Create two arrays.
  const sortData = [];
  const sortArray = [];

  // Find all sortBy properties of each object in data array
  // and push it to sortedArray.
  for (let i = 0; i < content.length; i++) {
    sortArray.push(content[i][sortBy]);
  }

  // Check direction of sorting and sort sortArray
  // according to outcome in if statement for names.
  if (sortBy === 'name' && dir === 'up') {
    if (dir === 'up') {
      sortArray.sort();
    } else {
      sortArray.reverse();
    }
  } else if (sortBy !== 'name' && dir === 'down') {
    sortArray.sort(function sorting(a, b) {
      return b - a;
    });
  } else {
    sortArray.sort(function sorting(a, b) {
      return a - b;
    });
  }

  // Every iteration through sortArray look for value(in data)
  // to match corresponding value in sortArray.
  sortArray.forEach(function createSortedData(value) {
    for (let i = 0; i < content.length; i++) {
      if (content[i][sortBy] === value) {
        sortData.push(content[i]);
      }
    }
  });

  // return new sorted data
  return sortData;
}

function recreateNodes(sortBy, content, dir) {
  document.querySelector('.sort-table__body').innerHTML = '';
  createNodes(sort(sortBy, content, dir));
}

// based on new sorted data create cells of table
export function createNodes(newData) {
  const mainFragment = document.createDocumentFragment();
  const cellFragment = document.createDocumentFragment();
  newData.forEach((person) => {
    const row = createRow();

    properDataOrder.forEach((value) => {
      const cell = createCell(value, person[value]);
      cellFragment.append(cell);
    });

    row.append(cellFragment);
    mainFragment.append(row);
  });
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

export function addListeners(content) {
  const tableHeader = document.querySelector('.sort-table__header'),
    input = document.querySelector('#my-input');
  // set event listener to the head of the table
  tableHeader.addEventListener('click', (e)=> enableSorting(e, content));
  tableHeader.addEventListener('keydown', (e)=> enableSorting(e, content));

  // set event listener to input to trigger function each time user enters something in field
  input.addEventListener('keyup', searchByName);
}

function enableSorting(e, content) {
  // check pressed key
  if (e.code !== undefined && e.code !== 'Enter') {
    return;
  }

  if (e.target.id) {
    // Create variable in which store value from dataset attribute.
    const atrSorted = document.querySelector(`.sort-table__${e.target.id}-title`).dataset.sorted;
    let direction;

    // Change direction to the opposite of atrSorted(toggle direction)
    // and call recreateNodes function with parameters due to where user click.
    if (atrSorted) {
      if (atrSorted === 'upSorted') {
        direction = 'down';
        recreateNodes(e.target.id, content, direction);
      } else {
        direction = 'up';
        recreateNodes(e.target.id, content, direction);
      }
    } else {
      direction = 'up';
      recreateNodes(e.target.id, content, direction);
    }
  }
}

function searchByName() {
  // Transform what user enters to upper case.
  const listOfNames = document.querySelectorAll('.sort-table__name');
  const char = this.value.toUpperCase();

  for (let i = 0; i < listOfNames.length; i++) {
    // Check if characters match by transform to upper case as well.
    if (listOfNames[i].innerHTML.toUpperCase().indexOf(char) !== 0) {
      listOfNames[i].parentElement.style.display = 'none';
    } else {
      listOfNames[i].parentElement.style.display = 'table-row';
    }
  }
}
