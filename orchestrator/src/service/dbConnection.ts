import mongoose from 'mongoose';

export async function connectDB() {
    const db = (await mongoose.connect(process.env.MONGO_URL as string)).connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () { console.log('Connected mongo') });
    return db
}