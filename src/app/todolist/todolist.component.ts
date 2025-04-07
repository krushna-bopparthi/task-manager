import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

interface Task {
  taskName: string;
  isCompleted: boolean;
  dueDate?: string; // Optional due date field
  priority: 'Low' | 'Medium' | 'High'; // Priority levels
}

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {
  taskArray: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]'); // Load from localStorage if available
  filteredTasks: Task[] = this.taskArray;
  searchQuery: string = ''; // For searching tasks by name
  priorities: string[] = ['Low', 'Medium', 'High']; // Possible priorities

  constructor() { }

  ngOnInit(): void {
    this.loadTasksFromLocalStorage();
  }

  // Submit form to add a task
  onSubmit(form: NgForm): void {
    if (form.valid) {
      const newTask: Task = {
        taskName: form.controls['task'].value,
        isCompleted: false,
        dueDate: form.controls['dueDate'].value,
        priority: form.controls['priority'].value
      };
      this.taskArray.push(newTask);
      this.updateLocalStorage();
      this.filteredTasks = [...this.taskArray];  // Ensure filtered tasks are updated
      form.reset();
    }
  }

  // Delete a task by its index
  onDelete(index: number): void {
    this.taskArray.splice(index, 1);
    this.updateLocalStorage();
    this.filteredTasks = [...this.taskArray];  // Update filtered tasks after deletion
  }

  // Toggle the completion status of a task
  onCheck(index: number): void {
    this.taskArray[index].isCompleted = !this.taskArray[index].isCompleted;
    this.updateLocalStorage();
    this.filteredTasks = [...this.taskArray];  // Ensure filtered tasks are updated
  }

  // Edit a task's details
  onEdit(index: number): void {
    const editedTask = this.taskArray[index];
    // Pre-fill the form with task data for editing (this can be further implemented as needed)
    alert(`Editing task: ${editedTask.taskName}`);
  }

  // Filter tasks by completion status
  filterTasks(status: string): void {
    if (status === 'completed') {
      this.filteredTasks = this.taskArray.filter(task => task.isCompleted);
    } else if (status === 'pending') {
      this.filteredTasks = this.taskArray.filter(task => !task.isCompleted);
    } else {
      this.filteredTasks = [...this.taskArray];
    }
  }

  // Search tasks by name
  onSearch(query: string): void {
    this.searchQuery = query.toLowerCase();
    this.filteredTasks = this.taskArray.filter(task =>
      task.taskName.toLowerCase().includes(this.searchQuery)
    );
  }

  // Sort tasks based on a chosen criteria (priority, due date, name)
  sortTasks(criteria: string): void {
    if (criteria === 'priority') {
      this.filteredTasks.sort((a, b) => this.priorities.indexOf(a.priority) - this.priorities.indexOf(b.priority));
    } else if (criteria === 'dueDate') {
      this.filteredTasks.sort((a, b) => {
        // Handle case where dueDate may be undefined or empty
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return dateA - dateB;
      });
    } else if (criteria === 'taskName') {
      this.filteredTasks.sort((a, b) => a.taskName.localeCompare(b.taskName));
    }
  }
  

  // Clear all tasks
  clearAllTasks(): void {
    this.taskArray = [];
    this.updateLocalStorage();
    this.filteredTasks = [];  // Clear filtered tasks as well
  }

  // Update local storage when tasks change
  updateLocalStorage(): void {
    localStorage.setItem('tasks', JSON.stringify(this.taskArray));
  }

  // Load tasks from localStorage
  loadTasksFromLocalStorage(): void {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    if (savedTasks && Array.isArray(savedTasks)) {
      this.taskArray = savedTasks;
      this.filteredTasks = [...this.taskArray]; // Ensure filtered tasks reflect all loaded tasks
    }
  }
}
