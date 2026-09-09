// 1 - Variables and Data Types
const name = "Saya";    //primitive value
const age = 20;         //primitive value
const active = true;    //primitive value
const courses = ["React", " iOS", " IT Project Management"]; //reference value
const address = {                                            //reference value
    city : "Almaty",
    country : "Kazakhstan"
};
const sentence = `^^My name is ${name}, I am ${age} years old^^`; 

const phoneNum = null;

let hobby;

document.querySelector("#task1-results").innerHTML = `
    <h3>Task 1 - Variables and Data Types</h3>
    <p>Student name: ${name} — ${typeof name}</p>
    <p>Age: ${age} — ${typeof age}</p>
    <p>Active: ${active} - ${typeof active}</p>
    <p>Courses: ${courses} - ${typeof courses}</p>
    <p>Address: ${address.city}, ${address.country} - ${typeof address}</p> 

    <p>Sentence: ${sentence}</p>   
    <p>Phone number: ${phoneNum}</p>
    <p>Hobby: ${hobby}</p>

`;


// 2 - Arrays
const array = [3,7,2,10,5];
const doubled = array.map(array => array * 2);
const greater_than_5 = array.filter(array => array > 5);
const first_greater_than_5 = array.find(array => array > 5);
const sum = array.reduce((total, num) => total + num, 0);
const ten_exist = array.includes(10);

document.querySelector("#task2-results").innerHTML = `
    <h3>Task 2 — Arrays</h3>
    <p>Original array: ${array}</p>
    <p>Array multiplied by 2: ${doubled}</p>
    <p>Array greater than 5: ${greater_than_5}</p>
    <p>First number in array greater than 5: ${first_greater_than_5}</p>
    <p>Sum: ${sum}</p>
    <p>10 exists: ${ten_exist}</p>
`;


//3 - Arrays of Objects
const students = [
        {id: 1, name: "Anna", grade: 85},
        {id: 2, name: "John", grade: 62},
        {id: 3, name: "Sara", grade: 91},
        {id: 4, name: "Mike", grade: 55}
]

const greater_than_70 = students.filter(student => student.grade >= 70);
const student_names = students.map(student => student.name);
const third_student = students.find(student => student.id === 3);
const highest_grade = students.reduce((best, student) => student.grade > best.grade ? student : best);
const total_grade = students.reduce((sum, student) => sum + student.grade, 0);
const average = total_grade / students.length;
const student_has_passed = students.map(student => ({...student, passed: student.grade >= 70}));

document.querySelector("#task3-results").innerHTML = `
    <h3>Task 3 — Arrays of Objects</h3>
    <p>Grades with grade >=70: ${greater_than_70.map(student => student.name).join(", ")}</p>
    <p>Student names: ${student_names.join(", ")}</p>
    <p>Student with ID = 3: ${third_student.name}, ${third_student.grade} </p>
    <p>Student with the highest grade: ${highest_grade.name} - ${highest_grade.grade}</p>
    <p>Average grade: ${average}</p>
    <p>Students with passed status: ${student_has_passed.map(student => `${student.name}: ${student.passed}`).join(", ")}</p>
`;



//4 - Objects
const user = {
    id: 1,
    name: "Sophia",
    age: 22,
    address: {
        city: "Almaty",
        street: "Tole bi"
    }
};

const user_name = user.name;
const city = user.address.city;

user.age = 23;
user.email = "sophia@gmail.com";

delete user.address.city;

//const { name, age } = user;

const {
    address: { city: user_city }
} = user;

const { name: userName } = user;

document.querySelector("#task4-results").innerHTML = `
    <h3>Task 4 — Objects</h3>
    <p>The name and the city: ${user.name}, ${user.address.city}</p>
`;



//5 - VALUES AND REFERENCES
let orig = { 
    name: "Alice",
    score: 10
};
let copy = orig;
copy.score = 15;

let orig2 = { 
    name: "Alice",
    score: 10
};

let copy2 = { ...orig2};  //spread operator - создался новый объект
copy2.score = 13;


let user2 = {
    name: "Alice",
    address: {
        city: "Almaty"
    }
};
let user_copy = {...user2};
user_copy.address.city = "London";

let correct_user2 = {
    name: "Alice",
    address: {
        city: "Almaty"
    }
};
let correct_user2_copy = {
    ...correct_user2,
    address: {
        ...correct_user2.address
    }
};
correct_user2_copy.address.city = "London";

document.querySelector("#task5-results").innerHTML = `
    <h3>Task 5 - Values and References</h3>
    <p>1.The original ${orig.score} has changed to: ${copy.score}</p>
    <p>2.The original ${orig2.score} has changed to: ${copy2.score}</p>
    <p>3.The original city: ${user2.address.city} to: ${user_copy.address.city}</p>
    <p>4.The original city ${correct_user2.address.city} to ${correct_user2_copy.address.city}</p>
`


//6 - FUNCTIONS
function isEven(number){
    return number % 2 === 0; 
}


function getFullName(firstName, lastName){
    return firstName + lastName;
}


function calculatePrice(price, quantity){
    return price * quantity;
}


function calculateDiscount(price, percent){
    return price - (price * percent / 100);
}


function getMax(a, b){
    return a > b ? a : b;
}


const isEvenArrow = (number) => {
    return number % 2 === 0;
}

document.querySelector("#task6-results").innerHTML = `
    <h3>Task 6 - Functions</h3>
    <p>Is 14 even? - ${isEven(14)}</p>
    <p>Is 233 even? - ${isEven(233)}</p>
    <p>Full name: ${getFullName("Saya ", "Smakova")}</p>
    <p>Calculated price: ${calculatePrice(5500, 4)}</p>
    <p>Calculate discount: ${calculateDiscount(7000, 20)} </p>
    <p>Max: ${getMax(22, 67)} </p>
    <p>Is 56 even? - ${isEvenArrow(56)}</p>
`



//7 - FUNCTIONS AS VALUES
function add(a,b){
    return a + b;
}

function multiply(a,b){
    return a * b;
}

function calculate(a, b, operation){
    return operation(a, b);
}

document.querySelector("#task7-results").innerHTML = `
    <h3>Task 7 - Functions as Values</h3>
    <p>Added: ${add(123, 321)}</p>
    <p>Multiplied: ${multiply(44, 7)}</p>
    <p>1.Calculate: ${calculate(13, 30, add)}</p>
    <p>2.Calculate: ${calculate(50, 15, multiply)}</p>
`



//8 - SCOPE
const message = "global";

function showMessages(){
    const message = "function";

    let result = `
        <p>Function scope: ${message}</p>
    `;

    if (true) {
        const message = "block";

        result += `<p>Block scope: ${message} </p>`;

    }
    return result;
}

if (true) {
    var varVariable = "var";
    let letVariable = "let";
    const constVariable = "const";
}

document.querySelector("#task8-results").innerHTML = `
    <h3>Task 8 - Scope</h3>
    <p>Global scope: ${message}</p>
    ${showMessages()}

    <p>var outside block: ${varVariable}</p>
    <p>let outside block: not accessible</p>
    <p>const outside block: not accessible</p>
`;


//9 - CLOSURE
function createCounter(){
    let count = 0;

    return function(){
        count++;
        return count;
    }
}

const counter = createCounter();


function createAdder(value){
    return function(number){
        return number + value;
    }
}
const addFive = createAdder(5);

document.querySelector("#task9-results").innerHTML = `  
    <h3>Task 9 - Closure</h3>
    <p>counter() → ${counter()}</p>
    <p>counter() → ${counter()}</p>
    <p>counter() → ${counter()}</p>

    <p>addFive(10) → ${addFive(10)}</p>
    <p>addFive(20) → ${addFive(20)}</p>
`



//10 -  Destructuring, Spread and Rest
const numbers_ = [10, 20, 30, 40];
const[first, second] = numbers_;

const user_ = {
    id: 1,
    name1: "Anna",
    age1: 21
};

const { name1, age1 } = user_;

const newNumbers = [...numbers_, 50];

const newUser = {
    ...user_,
    age1: 22
};

const userWithEmail = {
    ...user_,
    email1: "anna@example.com"
};

const numbers1 = [1, 2, 3];
const numbers2 = [4, 5, 6];

const combined = [...numbers1, ...numbers2];

function sum_(...numbers) {
    return numbers.reduce((total, number_) => total + number_, 0);
}


document.querySelector("#task10-results").innerHTML = `
    <h3>Task 10 - Destructuring, Spread and Rest</h3>
    <p>First: ${first}</p>
    <p>Second: ${second}</p>

    <p>Name: ${name1}</p>
    <p>Age: ${age1}</p>

    <p>New numbers: ${newNumbers.join(", ")}</p>

    <p>New user age: ${newUser.age1}</p>

    <p>Email: ${userWithEmail.email1}</p>

    <p>sum(1, 2) → ${sum_(1, 2)}</p>
    <p>sum(1, 2, 3, 4) → ${sum_(1, 2, 3, 4)}</p>
`;




//Task 11 - Optional Chaining and Default Values
const user3 = {
    name3: "Anna",
    address3: {
        city3: "Almaty"
    }
};

const user4 = {
    name4: "John"
};


const city3 = user3.address3?.city3 ?? "City not specified";
const city4 = user4.address3?.city3 ?? "City not specified";

const zero = 0;
const empty = "";
const bool = false;
const nullValue = null;
let undefinedValue;

const zeroOr = zero || "default";
const zeroNullish = zero ?? "default";

const emptyOr = empty || "default";
const emptyNullish = empty ?? "default";

const boolOr = bool || "default";
const boolNullish = bool ?? "default";

const nullOr = nullValue || "default";
const nullNullish = nullValue ?? "default";

const undefinedOr = undefinedValue || "default";
const undefinedNullish = undefinedValue ?? "default";


document.querySelector("#task11-results").innerHTML = `
    <h3>Task 11 - Optional Chaining and Default Values</h3>

    <p>Anna's city: ${city3}</p>
    <p>John's city: ${city4}</p>

    <h3>|| vs ??</h3>

    <p>0 || "default": ${zeroOr}</p>
    <p>0 ?? "default": ${zeroNullish}</p>

    <p>"" || "default": ${emptyOr}</p>
    <p>"" ?? "default": ${emptyNullish}</p>

    <p>false || "default": ${boolOr}</p>
    <p>false ?? "default": ${boolNullish}</p>

    <p>null || "default": ${nullOr}</p>
    <p>null ?? "default": ${nullNullish}</p>

    <p>undefined || "default": ${undefinedOr}</p>
    <p>undefined ?? "default": ${undefinedNullish}</p>
`;

function toggleTask(taskId, button) {
    const task = document.getElementById(taskId);

    if (task.style.display === "none" || task.style.display === "") {
        task.style.display = "block";
        button.textContent = "Close Task";
    } else {
        task.style.display = "none";
        button.textContent = "Open Task";
    }
}


//FINAL TASK

const final_students = [
    {
        id: 1,
        name: "Sara",
        age: 20,
        grades: [81, 85, 87, 91]
    },
    {
        id: 2,
        name: "Nazerke",
        age: 19,
        grades: [90, 92, 95, 85]
    },
    {
        id: 3,
        name: "Qalamqas",
        age: 21,
        grades: [88, 90, 91, 80]
    },
    {
        id: 4,
        name: "Sultan",
        age: 20,
        grades: [95, 90, 93, 89]
    },
    {
        id: 5,
        name: "Syrym",
        age: 19,
        grades: [69, 62, 61, 63]
    }
];

function getAverage(grades){
    return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
};

function getStudentAverage(student) {
    return getAverage(student.grades);
}


function getPassedStudents(students) {
    return students.filter(student => getStudentAverage(student) >= 70);
}


function getStudentNames(students) {
    return students.map(student => student.name);
}


function findStudent(students, id) {
    return students.find(student => student.id === id);
}


function getTopStudent(students) {
    return students.reduce((top, student) =>
        getStudentAverage(student) > getStudentAverage(top)
            ? student
            : top
    );
}


const studentResults = final_students.map(student => ({
    id: student.id,
    name: student.name,
    average: getStudentAverage(student),
    passed: getStudentAverage(student) >= 70
}));


document.querySelector("#task12-results").innerHTML = `
    <h3>Final Task - Students</h3>

    <p><strong>Average of Anna's grades:</strong> 
        ${getAverage(final_students[0].grades).toFixed(2)}
    </p>

    <p><strong>John's average:</strong> 
        ${getStudentAverage(final_students[1]).toFixed(2)}
    </p>

    <p><strong>Passed students:</strong> 
        ${getPassedStudents(final_students).map(student => student.name).join(", ")}
    </p>

    <p><strong>Student names:</strong> 
        ${getStudentNames(final_students).join(", ")}
    </p>

    <p><strong>Student with ID 3:</strong> 
        ${findStudent(final_students, 3).name}
    </p>

    <p><strong>Top student:</strong> 
        ${getTopStudent(final_students).name} -
        ${getStudentAverage(getTopStudent(final_students)).toFixed(2)}
    </p>

    <h3>Final Results</h3>

    ${studentResults.map(student => `
        <p>
            ID: ${student.id} |
            Name: ${student.name} |
            Average: ${student.average.toFixed(2)} |
            Passed: ${student.passed}
        </p>
    `).join("")}
`;
