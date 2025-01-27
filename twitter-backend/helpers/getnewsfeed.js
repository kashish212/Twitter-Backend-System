import {db} from '../firebase/firebaseConfig.js';
import { collection, doc, getDoc, setDoc, updateDoc, Timestamp, serverTimestamp, query, where, orderBy, limit, limitToLast, getDocs } from 'firebase/firestore';
import {v4 as uuid} from 'uuid';
import _ from 'lodash';

const user_ids = ["oYcbiEay3BD95HhrDdZV", "klpPXby4GOa9uG0YUG3g", "groKPU9W4feRuMxDJx8R", "FpNlaOYFdGaiW9eQuYOp", "IBpsF512nHDdqifus3uQ", "asdfg"];
const total_ids = 6;
const max_tweets_in_feed = 10;

export async function getNewsFeed(req, res) {
    const id = req.params.id;//between 1 to 5 to fetch feed of corresponding user
    
    if(id<1 || id>total_ids){
        return res.sendStatus(400);
    }

    const user_id = user_ids[id-1];
    const collRef = collection(db, "followers");
    const q = query(collRef, where('followers', 'array-contains', user_id), orderBy('latestTweet', 'desc'), limit(max_tweets_in_feed));
    try{
        const dataSnapshot = await getDocs(q);
        if(dataSnapshot.empty){
            console.log('no documents found');
            res.status(200).json({
                "feed" : "Empty"
            });
        }
        else{
            console.log(dataSnapshot);
            console.log(dataSnapshot.recentTweets);
            console.log(dataSnapshot.latestTweet);
            console.log(dataSnapshot.followers);
            const data = dataSnapshot.docs.map(doc => doc.data());
            const posts = data.reduce((a, b) => a.concat(b.recentTweets), []);
            const sortedPosts = posts.sort((a, b) => b.published);
            console.log(sortedPosts.length);
            while(sortedPosts.length>10){
                sortedPosts.pop();
            }
            console.log(sortedPosts.length);
            res.status(200).json({
                "feed" : sortedPosts
            });
        }
    }  
    catch(e) {
        console.log(e);
        return res.sendStatus(500);
    }
}
//module.exports = getNewsFeed;
// export default getNewsFeed;