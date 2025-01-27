import {db} from '../firebase/firebaseConfig.js';
import { collection, doc, getDoc, setDoc, updateDoc, Timestamp, serverTimestamp, arrayUnion, arrayRemove } from 'firebase/firestore';
import {v4 as uuid} from 'uuid';
import _ from 'lodash';

//For picking an author randomly
//Ideally these constants should be in a global file but they are just dummy for testing.
const user_ids = ["oYcbiEay3BD95HhrDdZV", "klpPXby4GOa9uG0YUG3g", "groKPU9W4feRuMxDJx8R", "FpNlaOYFdGaiW9eQuYOp", "IBpsF512nHDdqifus3uQ"];
const total_ids = 5;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export async function postTweet(req, res){
    // const id = uuid();
    const content = req.body.content;
    const t = Timestamp.now();
    // const timestamp = new Date().getTime();

    if(!content){
        return res.sendStatus(400);
    }

    //Create a document reference and pass collection path only to Auto-ID doc & then retrieve the id
    const newTweetRef = doc(collection(db, "tweets"));
    const id_ = newTweetRef.id; 

    let data = {
        author: user_ids[getRandomInt(total_ids)],
        tweet_id: id_,
        published: t.seconds,
        body: content
    }

    // Store relevant data in database
    try{
        await setDoc(newTweetRef, data);
        updateLatestTweetsList(data);
        res.status(201).json({
            "id" : id_
        });

        //Alternative this can be used if uuid based id is required, merge is still not required
        // await setDoc(doc(db, "tweets", id), data, {merge: true});
    }
    catch(e) {
        console.log(e);
        return res.sendStatus(500);
    }
}
// export default postTweet;

async function updateLatestTweetsList(data) {
    const docRef = doc(db, "followers", data.author);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const docData = docSnap.data();
        docData.latestTweet = data.published;
        docData.recentTweets.push({
            author: data.author,
            tweet_id: data.tweet_id,
            published: data.published,
            body: data.body
        });
        console.log("Document data:\n", docData.recentTweets);
        docData.recentTweets.sort((a,b) => b.published - a.published);
        if(docData.recentTweets.length>10){
            docData.recentTweets.pop();
        }
        console.log("Document data:\n", docData.recentTweets);
        await setDoc(docRef, docData, {merge: true});
    } else {
        // doc.data() will be undefined in this case, hence creating one
        console.log("No such document, Creating...!");
        let data_ = {
            followers: [data.author],
            latestTweet: data.published,
            recentTweets: [{
                author: data.author,
                tweet_id: data.tweet_id,
                published: data.published,
                body: data.body
            }]
        }
        await setDoc(docRef, data_);
    }
}
