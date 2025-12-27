/**********************************************************
 * FIXED CREDENTIALS
 **********************************************************/

const ADMIN_EMAIL = "admin@college.edu";
const ADMIN_PASSWORD = "admin123";

const STUDENT_EMAIL = "student";
const STUDENT_PASSWORD = "student123";

/**********************************************************
 * INIT TEACHERS (ADMIN CONTROL)
 **********************************************************/
function initTeachers() {
  let users = JSON.parse(localStorage.getItem("users"));

  if (!users) {
    users = [];
  }

  const teachers = [
    {
      name: "Mr. Sharma",
      email: "sharma@college.edu",
      password: "teacher123",
      role: "teacher"
    },
    {
      name: "Ms. Gupta",
      email: "gupta@college.edu",
      password: "teacher456",
      role: "teacher"
    }
  ];

  teachers.forEach(t => {
    const exists = users.find(u => u.email === t.email);
    if (!exists) {
      users.push(t);
    }
  });

  localStorage.setItem("users", JSON.stringify(users));
}



initTeachers();

/**********************************************************
 * HELPERS
 **********************************************************/

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function getNotes() {
  return JSON.parse(localStorage.getItem("notes")) || [];
}

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

/**********************************************************
 * LOGIN (ONLY PLACE WHERE REDIRECT HAPPENS)
 **********************************************************/

function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  // ADMIN
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem("currentUser", JSON.stringify({ role: "admin" }));
    window.location.href = "admin.html";
    return;
  }

  // STUDENT (COMMON)
  if (email === STUDENT_EMAIL && password === STUDENT_PASSWORD) {
    localStorage.setItem("currentUser", JSON.stringify({ role: "student" }));
    window.location.href = "student.html";
    return;
  }

  // TEACHER
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let teacher = users.find(
    u => u.email === email && u.password === password
  );

  if (teacher) {
    localStorage.setItem("currentUser", JSON.stringify(teacher));
    window.location.href = "teacher.html";
    return;
  }

  alert("Invalid credentials");
}

/**********************************************************
 * PAGE PROTECTION (NO REDIRECT LOOP)
 **********************************************************/

function protectPage(role) {
  const user = getCurrentUser();
  if (!user || user.role !== role) {
    alert("Access denied");
    window.location.href = "index.html";
  }
}

/**********************************************************
 * LOGOUT
 **********************************************************/

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

/**********************************************************
 * TEACHER: UPLOAD NOTES (BUG-FREE)
 **********************************************************/
function uploadNote() {
  // Ensure DOM is loaded
  const titleInput = document.getElementById("noteTitle");
  const fileInput = document.getElementById("noteFile");

  if (!titleInput || !fileInput) {
    alert("ERROR: noteTitle or noteFile not found in HTML");
    return;
  }

  const title = titleInput.value.trim();
  const file = fileInput.files[0];

  if (!title) {
    alert("Please enter note title");
    return;
  }

  if (!file) {
    alert("Please select a file");
    return;
  }

  // File size safety (important)
  if (file.size > 5 * 1024 * 1024) {
    alert("File too large. Please upload files under 5MB.");
    return;
  }

  const reader = new FileReader();

  reader.onerror = function () {
    alert("Error reading file");
  };

  reader.onload = function (event) {
    let notes = [];

    try {
      notes = JSON.parse(localStorage.getItem("notes")) || [];
    } catch (e) {
      notes = [];
    }

    notes.push({
      id: Date.now(),
      title: title,
      data: event.target.result
    });

    localStorage.setItem("notes", JSON.stringify(notes));

    // Reset fields
    titleInput.value = "";
    fileInput.value = "";

    alert("Note uploaded successfully");

    // Call displayNotes ONLY if it exists
    if (typeof displayNotes === "function") {
      displayNotes();
    }
  };

  reader.readAsDataURL(file);
}

/**********************************************************
 * DISPLAY NOTES (TEACHER & STUDENT)
 **********************************************************/
function displayNotes() {
  const container = document.getElementById("notesList");
  if (!container) return;

  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const user = JSON.parse(localStorage.getItem("currentUser"));

  container.innerHTML = "";

  notes.forEach(note => {
    let noteHTML = `
      <div style="padding:5px; border-bottom:1px solid #ccc;">
        <strong>${note.title}</strong><br>
        <a href="${note.data}" target="_blank">Open</a>
    `;

    // Only show delete/edit buttons to teachers
    if (user && user.role === "teacher") {
      noteHTML += `
        <button style="margin-left:10px;" onclick="deleteNote(${note.id})">Delete</button>
        <button style="margin-left:5px;" onclick="editNote(${note.id})">Edit</button>
      `;
    }

    noteHTML += `</div>`;
    container.innerHTML += noteHTML;
  });
}

/**********************************************************
 * DELETE NOTE
 **********************************************************/
function deleteNote(id) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes = notes.filter(note => note.id !== id);
  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
}

/**********************************************************
 * EDIT NOTE
 **********************************************************/
function editNote(id) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const note = notes.find(n => n.id === id);
  if (!note) return;

  const newTitle = prompt("Edit Note Title:", note.title);
  if (newTitle !== null) {
    note.title = newTitle.trim();
    localStorage.setItem("notes", JSON.stringify(notes));
    displayNotes();
  }
}
