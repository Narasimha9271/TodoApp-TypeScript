import React, { useContext, useState, useEffect } from 'react';
import { authState } from '../store/authState.js';
import { useRecoilValue } from 'recoil';

interface Todo {
    _id: string;
    title: string;
    description: string;
    done: boolean;
}

type TodoArray = Todo[];

const TodoList = () => {
    const [todos, setTodos] = useState<TodoArray>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const authStateValue = useRecoilValue(authState);

    useEffect(() => {
        const getTodos = async () => {
            const response = await fetch('http://localhost:3000/todo/todos', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const data: Todo[] = await response.json();
            setTodos(data);
        };
        getTodos();
    }, []);

    const addTodo = async () => {
        const response = await fetch('http://localhost:3000/todo/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ title, description })
        });
        const data = await response.json();

        let newTodos = [...todos];
        newTodos.push(data);
        setTodos(newTodos);
    };

    const markDone = async (id) => {
        const response = await fetch(`http://localhost:3000/todo/todos/${id}/done`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const updatedTodo = await response.json();
        setTodos(todos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo)));
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h2 style={{ flex: 1 }}>Welcome {authStateValue.username}</h2>
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        window.location = '/login';
                    }}
                    style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '3px', cursor: 'pointer' }}
                >
                    Logout
                </button>
            </div>
            <h2>Todo List</h2>
            <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Title'
                style={{ padding: '8px', marginRight: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
            />
            <input
                type='text'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Description'
                style={{ padding: '8px', marginRight: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
            />
            <button
                onClick={addTodo}
                style={{ backgroundColor: '#3498db', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '3px', cursor: 'pointer' }}
            >
                Add Todo
            </button>

            {todos.map((todo) => (
                <div key={todo._id} style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <h3>{todo.title}</h3>
                    <p>{todo.description}</p>
                    <button
                        onClick={() => markDone(todo._id)}
                        style={{
                            backgroundColor: todo.done ? '#2ecc71' : '#e74c3c',
                            color: '#fff',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '3px',
                            cursor: 'pointer'
                        }}
                    >
                        {todo.done ? 'Done' : 'Mark as Done'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default TodoList;
