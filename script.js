'use strict';
const data = [
    {
        place: '1',
        name: 'William Atkinson',
        'firing-rate': '98',
        score: '90',
    },
    {
        place: '4',
        name: 'James Bailey',
        'firing-rate': '67',
        score: '100',
    },
    {
        place: '3',
        name: 'Harper Baker',
        'firing-rate': '42',
        score: '73',
    },
    {
        place: '2',
        name: 'Mason Ball',
        'firing-rate': '31',
        score: '203',
    },
    {
        place: '5',
        name: 'Jackson Anderson',
        'firing-rate': '48',
        score: '50',
    },
    {
        place: '6',
        name: 'Devon Allen',
        'firing-rate': '58',
        score: '30',
    },
];

(function renderTable(data) {
    // set default sort dirrection and by what we sort(sortBy)
    var sortDir = 'up',
        sortBy = 'place';
    createTable();
    createNodes(sort(sortBy, data, sortDir));
})(data);

// create table
function createTable() {
    // find table container
    const tableContainer = document.querySelector('#sort-table-container');

    // create element table
    var table = document.createElement('table');
    table.classList.add('sort-table');

    // create element table-head and append it inside table
    var tableHead = document.createElement('thead');
    tableHead.classList.add('sort-table__head');
    table.append(tableHead);

    // create element table-header and append it inside table-head
    var tableHeader = document.createElement('tr');
    tableHeader.classList.add('sort-table__header', 'sort-table__row');
    tableHead.append(tableHeader);

    // create loop to iterate over object properties to identify names of cells
    for (let name in data[0]) {
        //  create header-cell and append it inside table-header
        let headerCell = document.createElement('td');
        headerCell.classList.add(
            'sort-table__title-cell',
            `sort-table__${name}-title`
        );
        tableHeader.append(headerCell);

        //  create cell 'name' and append it inside header-cell
        let headerCellName = document.createElement('span');
        headerCellName.id = `${name}`;

        // check if string has unappropriated char for name
        if (name.indexOf('-') !== -1) {
            // if yes change it with one space
            name = name.replace('-', ' ');
        }
        headerCellName.innerHTML = `${name}`;
        headerCell.append(headerCellName);
    }

    // create table body and append it inside table
    var tableBody = document.createElement('tbody');
    tableBody.classList.add('sort-table__body');
    table.append(tableBody);

    // and append table to DOM
    tableContainer.append(table);
}

function sort(sortBy, data, dir) {
    // create dataset attribute in title cell with dataset property and set dirrection by which sort
    document.querySelector(
        `.sort-table__${sortBy}-title`
    ).dataset.sorted = `${dir}Sorted`;

    // create two arrays
    var sortData = [],
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
    } else if (dir === 'down') {
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
    var mainFragment = document.createDocumentFragment(),
        cellFragment = document.createDocumentFragment();

    for (let person of newData) {
        const row = createRow();

        for (const info in person) {
            const cell = createCell(info, person[info]);
            cellFragment.append(cell);
        }

        row.append(cellFragment);
        mainFragment.append(row);
        console.log(row);
    }

    document.querySelector('.sort-table__body').append(mainFragment);
}

function createRow() {
    const row = document.createElement('tr');
    row.classList.add('sort-table__row');
    return row;
}

function createCell(key, value) {
    const cell = document.createElement('td');
    // create class for cell using name of key
    cell.classList.add(`sort-table__${key}`);
    cell.classList.add('sort-table__cell');
    cell.innerHTML = `${value}`;
    return cell;
}

const tableHeader = document.querySelector('.sort-table__header');

// set event listener to head of table
tableHeader.addEventListener('click', function eventListener(e) {
    if (e.target.id) {
        // create variable in wich store value from dataset attribute
        const atrSorted = document.querySelector(
            `.sort-table__${e.target.id}-title`
        ).dataset.sorted;

        // change dirrection to the opposite of atrSorted(toggle dirrection)
        // and call recreateNodes function with parameters due to where user click
        if (atrSorted) {
            if (atrSorted === 'upSorted') {
                var dirrection = 'down';
                recreateNodes(e.target.id, data, dirrection);
            } else {
                var dirrection = 'up';
                recreateNodes(e.target.id, data, dirrection);
            }
        } else {
            var dirrection = 'up';
            recreateNodes(e.target.id, data, dirrection);
        }
    }
});

// search by name
const input = document.querySelector('#my-input');

// set event listener to input to triger function each time user enters something in field
input.addEventListener('keyup', function searchByName() {
    // transform what user enters to upper case
    var char = input.value.toUpperCase();
    const listOfNames = document.querySelectorAll('.sort-table__name');

    for (let i = 0; i < listOfNames.length; i++) {
        // and check if characters match by transform to upper case as well
        if (listOfNames[i].innerHTML.toUpperCase().indexOf(char) !== 0) {
            listOfNames[i].parentElement.style.display = 'none';
        } else {
            listOfNames[i].parentElement.style.display = 'table-row';
        }
    }
});

// style
// fix bug - table becomes smaller when tbody is empty(no user was found)
{
    const placeTitleCell = document.querySelector('.sort-table__place-title'),
        nameTitleCell = document.querySelector('.sort-table__name-title'),
        firingRateTitleCell = document.querySelector(
            '.sort-table__firing-rate-title'
        ),
        scoreTitleCell = document.querySelector('.sort-table__score-title');
    // set each element width of it's initial offset width
    placeTitleCell.style.width = `${placeTitleCell.offsetWidth}px`;
    nameTitleCell.style.width = `${nameTitleCell.offsetWidth}px`;
    firingRateTitleCell.style.width = `${firingRateTitleCell.offsetWidth}px`;
    scoreTitleCell.style.width = `${scoreTitleCell.offsetWidth}px`;
}
