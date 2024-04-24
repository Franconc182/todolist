import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css'

function App() {
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('tasks') || []));
  const [taskText, setTaskText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (taskText.trim() !== '') {
      const newTask = {
        id: uuidv4(),
        text: taskText,
        completed: false
      };
      setTasks([...tasks, newTask]);
      setTaskText('');
    } else {
      alert('Please enter a task!');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const deleteTask = (taskId) => {
    const newTasks = tasks.filter(task => task.id !== taskId);
    setTasks(newTasks);
  };

  const toggleTaskCompletion = (taskId) => {
    const newTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(newTasks);
  };

  const filteredTasks = tasks.filter(task => {
    const taskMatchesSearch = task.text.toLowerCase().includes(searchText.toLowerCase());
    if (!showCompleted) {
      return taskMatchesSearch && !task.completed;
    }
    return taskMatchesSearch;
  });

  return (
    <>
      <div className='container'>
        <div className='to-do-list'>
          <h2>My To-Do List</h2>
          <input
            className='input'
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyUp={handleKeyPress}
            placeholder="Add new task"
          />
          <button className='btn-add' onClick={addTask}>Add Task</button>
          <br />
          <input
            className='input'
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search tasks"
          />
          <label>
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={() => setShowCompleted(!showCompleted)}
            />
            Show completed tasks
          </label>
          <ul>
            {filteredTasks.map((task) => (
              <li key={task.id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                />
                <span className='task-style' style={{ textDecoration: task.id.completed ? 'line-through' : 'none' }}>
                  {task.text}
                </span>
                <button className='btn-delete' onClick={() => deleteTask(task.id)}><svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" class="icon">
                  <path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path>
                </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;