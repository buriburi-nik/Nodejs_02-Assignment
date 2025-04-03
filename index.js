const fs = require("fs");
const path = require("path");
const readline = require("readline");

/*
fs → Handles reading and writing to tasks.txt.

path → Ensures correct file path usage.

readline → Takes user input from the command line.
*/

const filePath = path.join(__dirname, "tasks.txt");
// __dirname means  it refer to a directory
// path.join(__dirname, "tasks.txt : it will creata a full path for tasks.txt

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * rocess.stdin: Reads user input.

process.stdout: Displays output.
 */

function addTask() {
  rl.question("Enter the task : ", (task) => {
    fs.appendFile(filePath, task + "\n", (err) => {
      //fs.appendFile(filePath, data, callback)
      if (err) throw err;
      console.log("Task added successfully!");
      showMenu();
    });
  });
}

function viewTasks() {
  fs.readFile(filePath, "utf8", (err, data) => {
    // "utf8" → Reads the file as text
    if (err) {
      console.log("No tasks found.");
    } else {
      console.log("\nYour Tasks:");
      console.log(data || "No tasks available.");
    }
    showMenu();
  });
}

function markTaskComplete() {
  fs.readFile(filePath, "utf8", (err, data) => {
    //fs.readFile(filePath, encoding, callback) reads the file contents.
    if (err || !data.trim()) {
      console.log("No tasks to mark.");
      return showMenu();
    }

    const tasks = data.split("\n").filter((task) => task.trim() !== "");
    tasks.forEach((task, index) => console.log(`${index + 1}. ${task}`));
    /*
    data.split("\n") → Splits the file content into an array of tasks (one per line).
    .filter((task) => task.trim() !== "") → Removes empty lines.
    
    */

    rl.question("Enter task number to mark as complete: ", (num) => {
      const index = parseInt(num) - 1;
      if (index >= 0 && index < tasks.length) {
        tasks[index] = `[Completed] ${tasks[index]}`;
        fs.writeFile(filePath, tasks.join("\n"), (err) => {
          if (err) throw err;
          console.log("Task marked as complete!");
        });
      } else {
        console.log("Invalid task number.");
      }
      showMenu();
    });
  });
}

function removeTask() {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err || !data.trim()) {
      console.log("No tasks to remove.");
      return showMenu();
    }

    const tasks = data.split("\n").filter((task) => task.trim() !== "");
    tasks.forEach((task, index) => console.log(`${index + 1}. ${task}`));

    rl.question("Enter task number to remove: ", (num) => {
      const index = parseInt(num) - 1;
      if (index >= 0 && index < tasks.length) {
        tasks.splice(index, 1);
        fs.writeFile(filePath, tasks.join("\n"), (err) => {
          if (err) throw err;
          console.log("Task removed successfully!");
        });
      } else {
        console.log("Invalid task number.");
      }
      showMenu();
    });
  });
}

function showMenu() {
  console.log("\nTask Manager Menu:");
  console.log("1. Add Task");
  console.log("2. View Tasks");
  console.log("3. Mark Task as Complete");
  console.log("4. Remove Task");
  console.log("5. Exit");

  rl.question("Choose an option: ", (choice) => {
    switch (choice) {
      case "1":
        addTask();
        break;
      case "2":
        viewTasks();
        break;
      case "3":
        markTaskComplete();
        break;
      case "4":
        removeTask();
        break;
      case "5":
        console.log("Goodbye!");
        rl.close();
        break;
      default:
        console.log("Invalid option. Please try again.");
        showMenu();
        break;
    }
  });
}

showMenu();
