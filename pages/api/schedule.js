import {differenceInHours, format, addHours } from 'date-fns';
import { firebaseServer } from '../../config/firebase/server';

const db = firebaseServer.firestore();
const profile = db.collection('profiles');
const agenda = db.collection('agenda');

const startAt = new Date(2021, 1, 1, 8, 0);
const endAt = new Date(2021, 1, 1, 17, 0);
const timeBlocks = [];

const totalHours = differenceInHours(endAt, startAt);

for (let blockIndex = 0; blockIndex <= totalHours; blockIndex++){
    const time = format(addHours(startAt, blockIndex), 'HH:mm');
    timeBlocks.push(time);
} 

const getUserId = async (username) => {
    const profileDoc = await profile
        .where('username', '==', username)
        .get()

    const { userId } = profileDoc.docs[0]?.data();
    return userId;
}

const setSchedule = async (req, res ) => {

    const { username, when, name, phone } = req.body;

    const userId = await getUserId(username);
    const doc = await agenda.doc(`${userId}#${when}`).get(); 

    if(doc.exists){
        res.status(400).json({message: 'Time Blocked!'});
        return 
    }

    try {
        const block = await agenda.doc(`${userId}#${when}`).set({
            userId,
            when,
            name,
            phone,
        });

        return res.status(200).json(block);
    } catch (error){
        res.status(400).send(error);
    }
}

const getSchedule = (req, res ) => {
    try {
        // const profileDoc = await profile
        // .where('username', '==', req.query.username)
        // .get();


        // const snapshot = await agenda
        // .where('userId', '==', profileDoc.userId)
        // .where('when', '==', req.query.when)
        // .get()

        return res.status(200).json(timeBlocks);
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