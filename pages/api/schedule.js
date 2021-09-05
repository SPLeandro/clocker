import {differenceInHours, format, addHours } from 'date-fns';
import { firebaseServer } from '../../config/firebase/server';

const db = firebaseServer.firestore();
const profile = db.collection('profiles');
const agenda = db.collection('agenda');

const startAt = new Date(2021, 1, 1, 8, 0);
const endAt = new Date(2021, 1, 1, 17, 0);
const timesBlockList = [];

const totalHours = differenceInHours(endAt, startAt);

for (let blockIndex = 0; blockIndex <= totalHours; blockIndex++){
    const time = format(addHours(startAt, blockIndex), 'HH:mm');
    timesBlockList.push(time);
} 

const getUserId = async (username) => {
    const profileDoc = await profile
        .where('username', '==', username)
        .get()

    if (!profileDoc.docs.length){
        return false;
    }

    const { userId } = profileDoc.docs[0]?.data();
    return userId;
}

const setSchedule = async (req, res ) => {

    const { username, time, date, name, phone } = req.body;

    const userId = await getUserId(username);
    const docId = `${userId}#${date}#${time}`;
    const doc = await agenda.doc(docId).get(); 

    if(doc.exists){
        res.status(400).json({message: 'Time Blocked!'});
        return 
    }

    try {
        const block = await agenda.doc(docId).set({
            userId,
            date,
            time,
            name,
            phone,
        });

        return res.status(200).json(block);
    } catch (error){
        res.status(400).send(error);
    }
}

const getSchedule = async (req, res ) => {
    try {
        const { username, date } = req.query;
        const userId = await getUserId(username);

        if(!userId){
            return res.status(404).json({message: 'Invalid username'}); 
        }

        const snapshot = await agenda 
            .where('userId', '==', userId)
            .where('date', '==', date)
            .get();     

        const docs = snapshot.docs.map(doc => doc.data());

        const result = timesBlockList.map(time => ({
            time,
            isBlocked: !!docs.find(doc => doc.time === time)
        }))

        return res.status(200).json(result);
    } catch (error){
        console.log(error);
        return res.status(401);
    }
}

const methods = {
    POST: setSchedule,
    GET: getSchedule,
}

export default async (req, res) => methods[req.method]
    ? methods[req.method](req,res) 
    : res.status(405);