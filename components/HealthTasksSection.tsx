import React, { useState, useEffect } from 'react';
import { useLanguage, useAuth } from '../App';
import type { Task, Priority } from '../types';
import { Plus, Trash2, User, Calendar, Bell, Pencil, X } from './Icons';
import { taskService } from '../services/taskService';

const priorityStyles: Record<Priority, { dot: string; text: string }> = {
  high: { dot: 'bg-red-500', text: 'text-red-800 dark:text-red-300' },
  medium: { dot: 'bg-yellow-500', text: 'text-yellow-800 dark:text-yellow-300' },
  low: { dot: 'bg-blue-500', text: 'text-blue-800 dark:text-blue-300' },
};

const HealthTasksSection: React.FC = () => {
    const { language, t } = useLanguage();
    const { currentUser } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
    const [newDueDate, setNewDueDate] = useState('');
    const [newReminderTime, setNewReminderTime] = useState('');
    const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
    
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editFormState, setEditFormState] = useState<Partial<Task>>({});

    useEffect(() => {
        if(currentUser) {
            setTasks(taskService.getTasksByUserId(currentUser.id));
        } else {
            setTasks([]);
        }
    }, [currentUser]);
    
    useEffect(() => {
        const setupNotifications = async () => {
            if (!('Notification' in window)) return;
            if (Notification.permission === 'default') {
                await Notification.requestPermission();
            }
            if (Notification.permission === 'granted') {
                 taskService.initializeTaskNotifications();
            }
        }
        setupNotifications();
    }, []);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskText.trim() || !currentUser) return;

        const newTask = taskService.createTask({
            text: newTaskText.trim(),
            priority: newTaskPriority,
            userId: currentUser.id,
            dueDate: newDueDate || undefined,
            reminderTime: newReminderTime || undefined,
        });
        
        setTasks(prevTasks => [...prevTasks, newTask]);
        setNewTaskText('');
        setNewTaskPriority('medium');
        setNewDueDate('');
        setNewReminderTime('');
    };

    const handleToggleTask = (id: number) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        const updatedTask = taskService.updateTask(id, { completed: !task.completed });
        if (updatedTask) {
            setTasks(tasks.map(t => t.id === id ? updatedTask : t));
        }
    };

    const handleDeleteTask = (id: number) => {
        setDeletingTaskId(id);
        setTimeout(() => {
            if (taskService.deleteTask(id)) {
                setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
            }
            setDeletingTaskId(null);
        }, 300); // Animation duration
    };

    const handleStartEdit = (task: Task) => {
        setEditingTaskId(task.id);
        setEditFormState({
            text: task.text,
            priority: task.priority,
            dueDate: task.dueDate || '',
            reminderTime: task.reminderTime || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingTaskId(null);
        setEditFormState({});
    };

    const handleSaveEdit = (id: number) => {
        const updatedTask = taskService.updateTask(id, {
            text: editFormState.text,
            priority: editFormState.priority,
            dueDate: editFormState.dueDate || undefined,
            reminderTime: editFormState.reminderTime || undefined,
        });
        if(updatedTask) {
            setTasks(tasks.map(t => t.id === id ? updatedTask : t));
        }
        setEditingTaskId(null);
        setEditFormState({});
    };

    const isOverdue = (task: Task) => {
        if (!task.dueDate || task.completed) return false;
        const dueDate = new Date(`${task.dueDate}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate < today;
    };

    const todayString = new Date().toISOString().split('T')[0];

    return (
        <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-green-900 dark:text-green-200 mb-4">{t('healthTasksTitle')}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">{t('healthTasksDescription')}</p>
                </div>
                
                <div className="max-w-4xl mx-auto">
                    {!currentUser ? (
                        <div className="text-center mt-8 p-8 bg-gray-100 dark:bg-gray-800/50 rounded-lg shadow-inner">
                            <User className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">{t('loginToSeeTasks')}</p>
                        </div>
                    ) : (
                        <>
                           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
                                <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                                    <div className="md:col-span-2 lg:col-span-3">
                                        <label htmlFor="newTask" className="sr-only">{t('addTaskPlaceholder')}</label>
                                        <input
                                            id="newTask"
                                            type="text"
                                            value={newTaskText}
                                            onChange={(e) => setNewTaskText(e.target.value)}
                                            placeholder={t('addTaskPlaceholder')}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 lg:col-span-3 lg:grid-cols-4">
                                        <div>
                                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('priority')}</label>
                                            <select
                                                id="priority"
                                                value={newTaskPriority}
                                                onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                                            >
                                                <option value="low">{t('low')}</option>
                                                <option value="medium">{t('medium')}</option>
                                                <option value="high">{t('high')}</option>
                                            </select>
                                        </div>
                                         <div>
                                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dueDate')}</label>
                                            <input type="date" id="dueDate" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} min={todayString} className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"/>
                                        </div>
                                         <div>
                                            <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('reminderTime')}</label>
                                            <input type="time" id="reminderTime" value={newReminderTime} onChange={e => setNewReminderTime(e.target.value)} disabled={!newDueDate} className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition disabled:opacity-50"/>
                                        </div>
                                        <button type="submit" className="flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-transform duration-300 transform hover:scale-105 self-end">
                                            <Plus className="w-5 h-5" />
                                            <span>{t('addTaskButton')}</span>
                                        </button>
                                    </div>
                                </form>
                           </div>

                            <div className="space-y-4">
                                {tasks.length === 0 ? (
                                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('emptyTasksMessage')}</p>
                                ) : (
                                    tasks.sort((a,b) => a.completed ? 1 : -1).map(task => (
                                        editingTaskId === task.id ? (
                                            // -- Edit View --
                                            <div key={task.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md animate-fadeIn">
                                                <input type="text" value={editFormState.text || ''} onChange={e => setEditFormState({...editFormState, text: e.target.value})} className="w-full p-2 mb-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                    <select value={editFormState.priority || 'medium'} onChange={e => setEditFormState({...editFormState, priority: e.target.value as Priority})} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                                                        <option value="low">{t('low')}</option>
                                                        <option value="medium">{t('medium')}</option>
                                                        <option value="high">{t('high')}</option>
                                                    </select>
                                                    <input type="date" value={editFormState.dueDate || ''} onChange={e => setEditFormState({...editFormState, dueDate: e.target.value})} min={todayString} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
                                                    <input type="time" value={editFormState.reminderTime || ''} onChange={e => setEditFormState({...editFormState, reminderTime: e.target.value})} disabled={!editFormState.dueDate} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"/>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleSaveEdit(task.id)} className="w-full bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600">{t('save')}</button>
                                                        <button onClick={handleCancelEdit} className="w-full bg-gray-200 dark:bg-gray-600 px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500">{t('cancel')}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // -- Normal View --
                                            <div
                                                key={task.id}
                                                className={`flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-all duration-300 border-l-4 ${isOverdue(task) ? 'border-red-500' : 'border-transparent'} ${task.completed ? 'opacity-60' : ''} ${deletingTaskId === task.id ? 'opacity-0 scale-95 -translate-x-full' : 'opacity-100 scale-100 translate-x-0'}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={task.completed}
                                                    onChange={() => handleToggleTask(task.id)}
                                                    className="w-6 h-6 rounded-full text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                                                />
                                                <div className="flex-grow">
                                                    <p className={`text-gray-800 dark:text-gray-200 transition-all duration-300 ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>{task.text}</p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-3 h-3 rounded-full ${priorityStyles[task.priority].dot}`}></div>
                                                            <span className={priorityStyles[task.priority].text}>{t(task.priority)}</span>
                                                        </div>
                                                        {task.dueDate && <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>{new Date(`${task.dueDate}T00:00:00`).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' })}</span></div>}
                                                        {task.reminderTime && <div className="flex items-center gap-1"><Bell className="w-4 h-4" /><span>{new Date(`1970-01-01T${task.reminderTime}`).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span></div>}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleStartEdit(task)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label={t('edit')}>
                                                        <Pencil className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Delete task">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default HealthTasksSection;
