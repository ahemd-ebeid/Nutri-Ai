import type { Task, Priority } from '../types';

const TASKS_KEY = 'nutriai_tasks';
const scheduledNotifications: Record<number, number> = {};

// --- Private Notification Scheduler ---
const _scheduleNotification = (task: Task) => {
    // Don't schedule if reminder is not set, task is done, or notifications are not supported/permitted.
    if (!task.dueDate || !task.reminderTime || task.completed || !('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }

    const [hours, minutes] = task.reminderTime.split(':').map(Number);
    const notificationTime = new Date(task.dueDate);
    // Use T00:00:00 to avoid timezone issues with date parsing
    const notificationDateTime = new Date(`${task.dueDate}T00:00:00`);
    notificationDateTime.setHours(hours, minutes, 0, 0);

    const delay = notificationDateTime.getTime() - new Date().getTime();

    if (delay > 0) {
        const timeoutId = window.setTimeout(() => {
            new Notification('NutriAI Health Goal Reminder', {
                body: task.text,
                icon: '/vite.svg',
                lang: 'en-US'
            });
            delete scheduledNotifications[task.id];
        }, delay);
        scheduledNotifications[task.id] = timeoutId;
    }
};

const _cancelNotification = (taskId: number) => {
    if (scheduledNotifications[taskId]) {
        clearTimeout(scheduledNotifications[taskId]);
        delete scheduledNotifications[taskId];
    }
};

// --- LocalStorage Helpers ---
const getTasks = (): Task[] => {
    const tasksJson = localStorage.getItem(TASKS_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
};

const saveTasks = (tasks: Task[]) => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};


export const taskService = {
    getTasksByUserId(userId: number): Task[] {
        const allTasks = getTasks();
        return allTasks.filter(task => task.userId === userId);
    },

    createTask(taskData: { text: string; priority: Priority; userId: number; dueDate?: string; reminderTime?: string }): Task {
        const allTasks = getTasks();
        const newTask: Task = {
            id: Date.now(),
            completed: false,
            ...taskData,
        };
        saveTasks([...allTasks, newTask]);
        _scheduleNotification(newTask);
        return newTask;
    },

    updateTask(taskId: number, updates: Partial<Omit<Task, 'id' | 'userId'>>): Task | null {
        _cancelNotification(taskId); // Always cancel previous notification on any update
        let allTasks = getTasks();
        const taskIndex = allTasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return null;

        const updatedTask = { ...allTasks[taskIndex], ...updates };
        allTasks[taskIndex] = updatedTask;
        saveTasks(allTasks);
        _scheduleNotification(updatedTask); // Attempt to schedule a new one
        return updatedTask;
    },

    deleteTask(taskId: number): boolean {
        _cancelNotification(taskId); // Cancel notification before deleting
        let allTasks = getTasks();
        const newTasks = allTasks.filter(task => task.id !== taskId);
        if (allTasks.length === newTasks.length) return false;

        saveTasks(newTasks);
        return true;
    },

    initializeTaskNotifications() {
        const allTasks = getTasks();
        // Clear any lingering timeouts from a previous session (e.g., hot reload)
        Object.values(scheduledNotifications).forEach(clearTimeout);
        // Schedule all pending notifications
        allTasks.forEach(_scheduleNotification);
    }
};