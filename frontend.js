"use strict";

window.addEventListener("DOMContentLoaded", initFrontend);

function initFrontend() {
  console.log("Frontend is running");

  // register buttons for sort
  document
    .querySelector("button#sort_first")
    .addEventListener("click", clickedSortFirstname);
  document
    .querySelector("button#sort_last")
    .addEventListener("click", clickedSortLastname);
  // register buttons for filters
  //    document.querySelectorAll("#filters a").forEach( function(element) { element.addEventListener("click", clickedFilter); } );
  document
    .querySelectorAll("#filters a")
    .forEach(element => element.addEventListener("click", clickedFilter));

  // register table clicks
  document
    .querySelector("table#studentlist")
    .addEventListener("click", clickedTable);
}

function clickedTable(event) {
  //    console.log("clicked table");
  //    console.log(event.target);

  const clicked = event.target;
  //    console.log(clicked.tagName);
  if (clicked.className.toLowerCase() === "delete_button") {
    // NOTE: When we have more buttons, check which kind was clicked (on class or something)
    clickedDelete(clicked);
  } else if (clicked.className.toLowerCase() === "details_button") {
    clickedDetails(clicked);
  }
}

function clickedDetails(detailsButton) {
  let tr = detailsButton.parentElement;

  while (tr.tagName !== "TR") {
    tr = tr.parentElement;
  }
  const studentId = tr.dataset.studentId;
  console.log(studentId);

  showDetails(tr);
}

function showDetails(tr) {
  document.querySelector("#student_details").style.visibility = "visible";
  console.log(tr);
  document.querySelector("#student_fullname").textContent =
    tr.querySelector("[data-firstname]").textContent +
    " " +
    tr.querySelector("[data-middlename]").textContent +
    " " +
    tr.querySelector("[data-lastname]").textContent;

  document.querySelector("#student_email").textContent =
    tr.querySelector("[data-firstname]").textContent + "@stud.kea.dk";
}

function clickedDelete(deleteButton) {
  //    console.log(deleteButton);
  // find the parent <tr> that has this deleteButton inside it
  let tr = deleteButton.parentElement;
  while (tr.tagName !== "TR") {
    tr = tr.parentElement;
  }

  // find the studentId
  const studentId = tr.dataset.studentId;
  console.log(studentId);

  deleteStudent(studentId);

  // animate the <tr> out
  animateDelete(tr);
  // remove that <tr>
  //tr.remove();
}

function animateDelete(tr) {
  document.querySelector("#student_details").style.visibility = "hidden";
  tr.style.transform = "translateX(-105%)";
  tr.style.transition = "transform 1s";

  // tr.classList.add("fly-out");
  const rect = tr.getBoundingClientRect();

  tr.addEventListener("transitionend", function() {
    // find the nextSibling (the tr below this)
    let nextSibling = tr.nextElementSibling;

    if (nextSibling !== null) {
      nextSibling.addEventListener("transitionend", function() {
        console.log("transition end");

        // reset all the translateY!
        let nextTr = tr.nextElementSibling;
        while (nextTr !== null) {
          nextTr.style.transform = "translateY(0)";
          nextTr.style.transition = "transform 0s";

          nextTr = nextTr.nextElementSibling;
        }

        // remove that <tr>
        tr.remove();
      });

      while (nextSibling !== null) {
        nextSibling.style.transform = "translateY(-" + rect.height + "px)";
        nextSibling.style.transition = "transform 0.5s";

        nextSibling = nextSibling.nextElementSibling;
      }
    } else {
      // no next sibling - just remove!
      tr.remove();
    }
  });
}

function clickedSortFirstname() {
  console.log("clickedSortFirstname");
  sortByFirstName();
  displayList(currentStudents);
}

function clickedSortLastname() {
  console.log("clickedSortLastname");
  sortByLastName();
  displayList(currentStudents);
}

// function clickedFilter(event) {
//   console.log("clickedFilter");
//   const filter = this.dataset.filter; // references data-filter="____"
//   console.log(event);
//   event.preventDefault();

//   // if filter === all, let the list be all students
//   if (filter === "all") {
//     currentStudents = allStudents;
//     displayList(currentStudents);
//   } else {
//     currentStudents = filterByHouse(filter);
//     displayList(currentStudents);
//   }
// }

function displayList(listOfStudents) {
  console.log("Display list");
  // clear the table
  document.querySelector("table#studentlist tbody").innerHTML = "";

  // foreach student in listOfStudents
  listOfStudents.forEach(function(student) {
    // clone a table-row for student
    const clone = document
      .querySelector("#student_template")
      .content.cloneNode(true);

    // fill in the clone with data
    clone.querySelector("[data-firstname]").textContent = student.firstName;
    clone.querySelector("[data-middlename]").textContent = student.middleName;
    clone.querySelector("[data-lastname]").textContent = student.lastName;

    // add the studentId to the <tr>
    clone.querySelector("tr").dataset.studentId = student.id;

    // append clone to table
    document.querySelector("table#studentlist tbody").appendChild(clone);
  });
}
