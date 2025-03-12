import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    title: {
        type: String, required: true
    },
    description: {
        type: String, required: true
    },
    payload: {
        type: JSON, required: true
    },
    status: {
        type: String, required: false, default: 'pending'
    },
    result: {
        type: String, required: false
    }
});

export const TaskModel = mongoose.model('Task', TaskSchema);

export const getAll = () => TaskModel.find();
export const create = (values: Record<string, any>) => new TaskModel(values).save().then((task) => task.toJSON());
export const update = (id: string, values: Record<string, any>) => TaskModel.findByIdAndUpdate(id, values);