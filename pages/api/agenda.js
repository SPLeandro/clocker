import {differenceInHours, format, addHours } from 'date-fns';
import { firebaseServer } from '../../config/firebase/server';

const db = firebaseServer.firestore();
const agenda = db.collection('agenda');

const startAt = new Date(2021, 1, 1, 8, 0);
const endAt = new Date(2021, 1, 1, 17, 0);
const timesBlockList = [];

const totalHours = differenceInHours(endAt, startAt);

for (let blockIndex = 0; blockIndex <= totalHours; blockIndex++){
    const time = format(addHours(startAt, blockIndex), 'HH:mm');
    timesBlockList.push({
        name: 'Disponível',
        time
    });
} 

export default async (req, res) => {
    const [, token] = req.headers.authorization.split(' ');

    if(!token){
        return res.status(401);
    }

    try {
        const {user_id} = await firebaseServer.auth().verifyIdToken(token);
        const snapshot = await agenda
        .where('userId', '==', user_id)
        .where('date', '==', req.query.date)
        .get();

        const docs = snapshot.docs.map(doc => doc.data());
        const usedTimes = docs.map(doc => doc.time);
        const availableTimes = timesBlockList.filter(block => !usedTimes.includes(block.time));
        
        const data = [
            ...docs,
            ...availableTimes
        ]

        return res.status(200).json(data);
    } catch (error){
        console.log(error);
        return res.status(401);
    }
}   