import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    title: {
        type: String, required: true
    },
    description: {
        type: String, required: true
    },
    status: {
        type: String, required: false, default: 'pending'
    }
});

export const TaskModel = mongoose.model('Task', TaskSchema);

export const getTasks = () => TaskModel.find();
export const createTask = (values: Record<string, any>) => new TaskModel(values).save().then((task) => task.toJSON());
export const updateTask = (id: string, values: Record<string, any>) => TaskModel.findByIdAndUpdate(id, values);