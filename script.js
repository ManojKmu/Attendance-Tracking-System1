const { Script } = require("vm");

//script.js
document.addEventListener("DOMContentLoaded",
    function () {
        populateClasses();
        showStudentsList();
    });

function showAddStudentForm() {
    document.getElementById('addStudentPopup').
        style.display = 'block';
}

function showAddClassForm() {
    // Show the add class popup
    document.getElementById('addClassPopup').
        style.display = 'block';
}

function addStudent() {
    // Get input values
    const newStudentName = document.
        getElementById('newStudentName').value;
    const newStudentRoll = document.
        getElementById('newStudentRoll').value;

    if (!newStudentName || !newStudentRoll) {
        alert("Please provide both name and roll number.");
        return;
    }

    // Add the new student to the list
    const classSelector = document.
        getElementById('classSelector');
    const selectedClass = classSelector.
        options[classSelector.selectedIndex].value;
    const studentsList = document.
        getElementById('studentsList');

    const listItem = document.createElement('li');
    listItem.setAttribute('data-roll-number', newStudentRoll);
    listItem.innerHTML =
        `<strong>
            ${newStudentName}
        </strong> 
        (Roll No. ${newStudentRoll})`;

    const absentButton =
        createButton('A', 'absent',
            () => markAttendance('absent', listItem, selectedClass));
    const presentButton =
        createButton('P', 'present',
            () => markAttendance('present', listItem, selectedClass));
    const leaveButton =
        createButton('L', 'leave',
            () => markAttendance('leave', listItem, selectedClass));

    listItem.appendChild(absentButton);
    listItem.appendChild(presentButton);
    listItem.appendChild(leaveButton);
    function showStudentsList() {
        const studentsList = document.getElementById("studentsList");
        studentsList.innerHTML = ""; // Clear the list
    
        // Example array of student objects (Replace with your dynamic data source)
        const students = [
            { id: 1, name: "John Doe" },
            { id: 2, name: "Jane Smith" }
        ];
        if (!newName.trim() || !newBranch.trim() || !newRoll.trim()) {
            alert("Fields cannot be empty!");
            return;
        }
        
        function deleteStudent(studentId) {
            // Locate the student in the list by data-id
            const studentElement = document.querySelector(`[data-id="${studentId}"]`);
            if (studentElement) {
                studentElement.remove(); // Remove the student entry
                alert(`Student with ID ${studentId} has been deleted.`);
            } else {
                alert("Student not found.");
            }
        }
        function editStudent(studentId) {
            const studentElement = document.querySelector(`[data-id="${studentId}"]`);
            
            if (studentElement) {
                // Get the current details
                const currentName = studentElement.querySelector('.student-name').textContent;
                const currentBranch = studentElement.querySelector('.student-branch').textContent;
                const currentRoll = studentElement.querySelector('.student-roll').textContent;
        
                // Prompt the user for new details
                const newName = prompt("Enter the new name:", currentName);
                const newBranch = prompt("Enter the new branch:", currentBranch);
                const newRoll = prompt("Enter the new roll number:", currentRoll);
        
                // Update the student's details if valid inputs are provided
                if (newName && newBranch && newRoll) {
                    studentElement.querySelector('.student-name').textContent = newName;
                    studentElement.querySelector('.student-branch').textContent = newBranch;
                    studentElement.querySelector('.student-roll').textContent = newRoll;
                    alert("Student details have been updated successfully.");
                } else {
                    alert("All fields are required!");
                }
            } else {
                alert("Student not found.");
            }
        }
         // Generate the list dynamically
        students.forEach(student => {
            const li = document.createElement("li");
            li.setAttribute("data-id", student.id);
            li.innerHTML = `
                <span class="student-name">${student.name}</span>
                <button onclick="editStudent('${student.id}')">Edit</button>
                <button onclick="deleteStudent('${student.id}')">Delete</button>
            `;
            studentsList.appendChild(li);
        });
    }
    
    studentsList.appendChild(listItem);
    saveStudentsList(selectedClass);
    // Function to delete a student
function deleteStudent(studentId) {
    const studentElement = document.querySelector(`[data-id="${studentId}"]`);
    if (studentElement) {
        studentElement.remove();
        alert(`Student with ID ${studentId} has been deleted.`);
    } else {
        alert("Student not found.");
    }
}

// Function to edit a student's name
function editStudent(studentId) {
    const studentName = prompt("Enter the new name for the student:");
    if (studentName) {
        const studentElement = document.querySelector(`[data-id="${studentId}"] .student-name`);
        if (studentElement) {
            studentElement.textContent = studentName;
            alert(`Student's name has been updated to ${studentName}.`);
        } else {
            alert("Student not found.");
        }
    }
}

    closePopup();
}

function addClass() {
    const newClassName = document.
        getElementById('newClassName').value;

    if (!newClassName) {
        alert("Please provide a class name.");
        return;
    }

    // Add the new class to the class selector
    const classSelector = document.
        getElementById('classSelector');
    const newClassOption = document.
        createElement('option');
    newClassOption.value = newClassName;
    newClassOption.text = newClassName;
    classSelector.add(newClassOption);
    saveClasses();
    closePopup();
}

function submitAttendance() {
    const classSelector = document.
        getElementById('classSelector');

    if (!classSelector || !classSelector.options ||
        classSelector.selectedIndex === -1) {
        console.error
            ('Class selector is not properly defined or has no options.');
        return;
    }

    const selectedClass = classSelector.
        options[classSelector.selectedIndex].value;

    if (!selectedClass) {
        console.error('Selected class is not valid.');
        return;
    }

    const studentsList =
        document.getElementById('studentsList');

    // Check if attendance is already submitted 
    // for the selected class
    const isAttendanceSubmitted =
        isAttendanceSubmittedForClass(selectedClass);

    if (isAttendanceSubmitted) {
        // If attendance is submitted, hide the 
        // summary and show the attendance result
        document.getElementById('summarySection').
            style.display = 'none';
        showAttendanceResult(selectedClass);
    } else {
        // If attendance is not submitted, show the summary
        document.getElementById('summarySection').
            style.display = 'block';
        document.getElementById('resultSection').
            style.display = 'none';
    }
    // Clear the student list and reset the form
    studentsList.innerHTML = '  ';
}

function isAttendanceSubmittedForClass(selectedClass) {
    const savedAttendanceData = JSON.parse
        (localStorage.getItem('attendanceData')) || [];
    return savedAttendanceData.some
        (record => record.class === selectedClass);
}

function showAttendanceResult(selectedClass) {
    const resultSection = document.
        getElementById('resultSection');

    if (!resultSection) {
        console.error('Result section is not properly defined.');
        return;
    }

    const now = new Date();
    const date =
        `${now.getFullYear()}-${String(now.getMonth() + 1).
        padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const time =
        `${String(now.getHours()).padStart(2, '0')}:
        ${String(now.getMinutes()).padStart(2, '0')}:
        ${String(now.getSeconds()).padStart(2, '0')}`;

    // Retrieve attendance data from local storage
    const savedAttendanceData = JSON.parse
        (localStorage.getItem('attendanceData')) || [];
    const filteredAttendanceData = savedAttendanceData.
        filter(record => record.class === selectedClass);

    const totalStudents = filteredAttendanceData.
    reduce((acc, record) => {
        if (!acc.includes(record.name)) {
            acc.push(record.name);
        }
        return acc;
    }, []).length;

    const totalPresent = filteredAttendanceData.
        filter(record => record.status === 'present').length;
    const totalAbsent = filteredAttendanceData.
        filter(record => record.status === 'absent').length;
    const totalLeave = filteredAttendanceData.
        filter(record => record.status === 'leave').length;

    // Update the result section
    document.getElementById('attendanceDate').
        innerText = date;
    document.getElementById('attendanceTime').
        innerText = time;
    document.getElementById('attendanceClass').
        innerText = selectedClass;
    document.getElementById('attendanceTotalStudents').
        innerText = totalStudents;
    document.getElementById('attendancePresent').
        innerText = totalPresent;
    document.getElementById('attendanceAbsent').
        innerText = totalAbsent;
    document.getElementById('attendanceLeave').
        innerText = totalLeave;

    // Show the attendance result section
    resultSection.style.display = 'block';
}

function closePopup() {
    // Close the currently open popup
    document.getElementById('addStudentPopup').
        style.display = 'none';
    document.getElementById('addClassPopup').
        style.display = 'none';
}

function createButton(text, status, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerText = text;
    button.className = status;
    button.onclick = onClick;
    return button;
}

function populateClasses() {
    // Retrieve classes from local storage
    const savedClasses = JSON.parse
        (localStorage.getItem('classes')) || [];
    const classSelector = 
        document.getElementById('classSelector');

    savedClasses.forEach(className => {
        const newClassOption = 
            document.createElement('option');
        newClassOption.value = className;
        newClassOption.text = className;
        classSelector.add(newClassOption);
    });
}

function showStudentsList() {
    const classSelector = 
        document.getElementById('classSelector');
    const selectedClass = classSelector.
        options[classSelector.selectedIndex].value;

    const studentsList = 
        document.getElementById('studentsList');
    studentsList.innerHTML = '';

    // Retrieve students from local storage
    const savedStudents = JSON.parse
        (localStorage.getItem('students')) || {};
    const selectedClassStudents = 
        savedStudents[selectedClass] || [];

    selectedClassStudents.forEach(student => {
        const listItem = document.createElement('li');
        listItem.setAttribute
            ('data-roll-number', student.rollNumber);
        listItem.innerHTML = 
            `<strong>
                ${student.name}
            </strong> 
            (Roll No. ${student.rollNumber})`;

        const absentButton = createButton('A', 'absent', 
            () => markAttendance('absent', listItem, selectedClass));
        const presentButton = createButton('P', 'present', 
            () => markAttendance('present', listItem, selectedClass));
        const leaveButton = createButton('L', 'leave', 
            () => markAttendance('leave', listItem, selectedClass));

        const savedColor = getSavedColor
            (selectedClass, student.rollNumber);
        if (savedColor) {
            listItem.style.backgroundColor = savedColor;
        }

        listItem.appendChild(absentButton);
        listItem.appendChild(presentButton);
        listItem.appendChild(leaveButton);

        studentsList.appendChild(listItem);
    });

    // Check if attendance for the 
    // selected class has been submitted
    const resultSection = document.
        getElementById('resultSection');
    const isAttendanceSubmitted = 
        resultSection.style.display === 'block';

    // Show the appropriate section based 
    // on the attendance submission status
    if (isAttendanceSubmitted) {
        // Attendance has been submitted, 
        // show the attendance result
        showAttendanceResult(selectedClass);
    } else {
        // Attendance not submitted, 
        // show the normal summary
        showSummary(selectedClass);
    }
}

function showAttendanceResult(selectedClass) {
    const resultSection = 
        document.getElementById('resultSection');

    if (!resultSection) {
        console.error('Result section is not properly defined.');
        return;
    }

    const now = new Date();
    const date = 
        `${now.getFullYear()}-${String(now.getMonth() + 1).
        padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const time = 
        `${String(now.getHours()).padStart(2, '0')}:
        ${String(now.getMinutes()).padStart(2, '0')}:
        ${String(now.getSeconds()).padStart(2, '0')}`;

    // Retrieve attendance data from local storage
    const savedAttendanceData = JSON.parse
        (localStorage.getItem('attendanceData')) || [];
    const filteredAttendanceData = savedAttendanceData.
        filter(record => record.class === selectedClass);

    const totalStudents = filteredAttendanceData.
    reduce((acc, record) => {
        if (!acc.includes(record.name)) {
            acc.push(record.name);
        }
        return acc;
    }, []).length;

    const totalPresent = filteredAttendanceData.
        filter(record => record.status === 'present').length;
    const totalAbsent = filteredAttendanceData.
        filter(record => record.status === 'absent').length;
    const totalLeave = filteredAttendanceData.
        filter(record => record.status === 'leave').length;

    // Update the result section
    const resultContent = 
        `Date: ${date} | Time: ${time} | 
        Total Students: ${totalStudents} | 
        Present: ${totalPresent} | 
        Absent: ${totalAbsent} | Leave: ${totalLeave}`;
    resultSection.innerHTML = resultContent;

    // Show the result section
    resultSection.style.display = 'block';

    // Show the list of students below the result section
    const studentsListHTML = 
        generateStudentsListHTML(filteredAttendanceData);
    resultSection.insertAdjacentHTML
        ('afterend', studentsListHTML);
}


function markAttendance
    (status, listItem, selectedClass) {
    // Find the corresponding student name
    const studentName = listItem.
        querySelector('strong').innerText;

    // Update the background color of the student 
    // row based on the attendance status
    listItem.style.backgroundColor = 
        getStatusColor(status);

    // Save the background color to local storage
    saveColor(selectedClass, 
        listItem.getAttribute('data-roll-number'), 
        getStatusColor(status));

    // Update the attendance record for the specific student
    updateAttendanceRecord(studentName, selectedClass, status);

    // Show the summary for the selected class
    showSummary(selectedClass);
}

function getStatusColor(status) {
    switch (status) {
        case 'absent':
            return '#e74c3c';
        case 'present':
            return '#2ecc71';
        case 'leave':
            return '#f39c12';
        default:
            return '';
    }
}

function updateAttendanceRecord
    (studentName, selectedClass, status) {
    // Retrieve existing attendance data from local storage
    const savedAttendanceData = JSON.parse
        (localStorage.getItem('attendanceData')) || [];

    // Check if the record already exists
    const existingRecordIndex = savedAttendanceData.
        findIndex(record => record.name === studentName && 
            record.class === selectedClass);

    if (existingRecordIndex !== -1) {
        // Update the existing record
        savedAttendanceData[existingRecordIndex].
            status = status;
        savedAttendanceData[existingRecordIndex].
            date = getCurrentDate();
    } else {
        // Add a new record
        savedAttendanceData.push(
            { 
                name: studentName, class: selectedClass, 
                status: status, date: getCurrentDate() 
            });
    }

    // Save updated attendance data to local storage
    localStorage.setItem('attendanceData', 
        JSON.stringify(savedAttendanceData));
}

function showSummary(selectedClass) {
    const savedAttendanceData = JSON.parse
        (localStorage.getItem('attendanceData')) || [];

    // Filter attendance data based on the selected class
    const filteredAttendanceData = savedAttendanceData.
        filter(record => record.class === selectedClass);

    const totalStudents = filteredAttendanceData.
    reduce((acc, record) => {
        if (!acc.includes(record.name)) {
            acc.push(record.name);
        }
        return acc;
    }, []).length;

    const totalPresent = filteredAttendanceData.
        filter(record => record.status === 'present').length;
    const totalAbsent = filteredAttendanceData.
        filter(record => record.status === 'absent').length;
    const totalLeave = filteredAttendanceData.
        filter(record => record.status === 'leave').length;

    document.getElementById('totalStudents').
        innerText = totalStudents;
    document.getElementById('totalPresent').
        innerText = totalPresent;
    document.getElementById('totalAbsent').
        innerText = totalAbsent;
    document.getElementById('totalLeave').
        innerText = totalLeave;
}

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).
        padStart(2, '0');
    const day = String(now.getDate()).
        padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function saveClasses() {
    // Save classes to local storage
    const classSelector = document.
        getElementById('classSelector');
    const savedClasses = Array.from(classSelector.options).
        map(option => option.value);
    localStorage.setItem('classes', 
        JSON.stringify(savedClasses));
}

function saveStudentsList(selectedClass) {
    // Save the updated student list to local storage
    const studentsList = document.
        getElementById('studentsList');
    const savedStudents = JSON.parse
        (localStorage.getItem('students')) || {};
    const selectedClassStudents = Array.from(studentsList.children).
    map(item => {
        return {
            name: item.querySelector('strong').innerText,
            rollNumber: item.getAttribute('data-roll-number')
        };
    });

    savedStudents[selectedClass] = selectedClassStudents;
    localStorage.setItem
        ('students', JSON.stringify(savedStudents));
}

function saveColor(selectedClass, rollNumber, color) {
    const savedColors = JSON.parse
    (localStorage.getItem('colors')) || {};
    if (!savedColors[selectedClass]) {
        savedColors[selectedClass] = {};
    }
    savedColors[selectedClass][rollNumber] = color;
    localStorage.setItem('colors', 
        JSON.stringify(savedColors));
}

function getSavedColor(selectedClass, rollNumber) {
    const savedColors = JSON.parse
        (localStorage.getItem('colors')) || {};
    return savedColors[selectedClass] ? 
        savedColors[selectedClass][rollNumber] : null;
}
function login() {
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Simple validation (for demonstration purposes)
    if (userId === "8340" && password === "Manoj") {
        localStorage.setItem('loggedIn', 'true'); // Mark user as logged in
        window.location.href = 'index.html'; // Redirect to main page
    } else {
        errorMessage.innerText = 'Invalid User ID or Password';
    }
}

function showForgotPassword() {
    document.getElementById('loginCard').style.display = 'none';
    document.getElementById('forgotPasswordCard').style.display = 'block';
}

function showLogin() {
    document.getElementById('forgotPasswordCard').style.display = 'none';
    document.getElementById('loginCard').style.display = 'block';
}

function resetPassword() {
    const email = document.getElementById('email').value;
    const resetMessage = document.getElementById('resetMessage');

    // Simulate sending a reset link (for demonstration purposes)
    if (email) {
        resetMessage.innerText = 'A password reset link has been sent to your email.';
        document.getElementById('email').value = '';
    } else {
        resetMessage.innerText = 'Please enter a valid email.';
    }
}
document.getElementById("notifyButton").addEventListener("click", function() {
    const studentName = document.getElementById("studentName").value;
    const parentPhone = document.getElementById("parentPhone").value;

    fetch("http://your-backend-api/send-sms", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ student: studentName, phone: parentPhone })
    })
    .then(response => response.json())
    .then(data => alert("Message Sent!"))
    .catch(error => console.error("Error sending message:", error));
});
