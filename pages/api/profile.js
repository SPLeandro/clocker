import { firebaseServer } from '../../config/firebase/server';

const db = firebaseServer.firestore();
const profile = db.collection('profiles');

const verifyUsername = async (req, res) => {

  const doc = await profile.doc(req.query.username).get();

  if(doc.exists){
    return res.status(405).json({error: {
      code: 'Username indisponível',
      message: 'Esse username já está sendo utilizado, por favor escolha outro.'
    }});
  }
  return res.status(200).json({code: 'Boa escolha', message: 'Este usuário está disponível para uso.'});
}

const setProfile = async (req, res) => {

  const [, token] = req.headers.authorization.split(' ');
  const {user_id}= await firebaseServer.auth().verifyIdToken(token);

  try {
    profile.doc(req.body.username).set({
      userId: user_id,
      username: req.body.username
    });
    return res.status(200).json({})
  } catch (error) {
    return res.status(405).json({error})
  } 
}

const methods = {
  POST: setProfile,
  GET: verifyUsername,
}

export default async (req, res) => methods[req.method]
  ? methods[req.method](req,res) 
  : res.status(405);