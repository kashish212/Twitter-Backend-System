import {db} from '../firebase/firebaseConfig.js';
import { collection, doc, getDoc, setDoc, updateDoc, Timestamp, serverTimestamp, arrayUnion, arrayRemove } from 'firebase/firestore';
import _ from 'lodash';

const user_ids = ["oYcbiEay3BD95HhrDdZV", "klpPXby4GOa9uG0YUG3g", "groKPU9W4feRuMxDJx8R", "FpNlaOYFdGaiW9eQuYOp", "IBpsF512nHDdqifus3uQ"];
const total_ids = 5;

export async function unfollow(req, res){
    //Here I'm taking index between 1 to 5 for simplicity
    const id1 = req.params.id1 - 1;//Follower ID
    const id2 = req.params.id2 - 1;//Followee ID

    console.log(id1);
    console.log(id2);

    if(id1>total_ids-1 || id1<0 || id2>total_ids-1 || id2<0)
    {
        return res.sendStatus(400);
    }

    const followersDocRef = doc(db, "followers", user_ids[id2]);
    await updateDoc(followersDocRef, {
        followers: arrayRemove(user_ids[id1])
    });
    res.sendStatus(200);
}