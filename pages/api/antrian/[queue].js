import Cors from 'cors';
import amxmlFetch from "../../../lib/amxmlFetch";
import initMiddleware from "../../../lib/initMiddleware";

const cors = initMiddleware(
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    Cors({
      // Only allow requests with GET, POST and OPTIONS
      methods: ['GET', 'POST', 'OPTIONS'],
    })
  )

export default async function QueueAntrian(req,res){
    await cors(req, res)
    if(req.method === "POST"){
        let queueEntry=[];
        console.log(req.query);
        const queue = req.query.queue;
        const posted = req.body
        // const params = query.params.replace(/;/g,'&')
        const target='http://localhost:8088/amxml?action=queuestatus&queue='+queue;
        // console.log('Server Side Join Queue');
        let result= await amxmlFetch(target,posted.user,posted.passw);
        const response = result['ajax-response']['response'];
        //console.log(response);
        const notif =  response[0].generic[0]['$'];
        let item = null
        for(var i=1;i<response.length;i++){
            item=response[i].generic[0]['$'];
            if (item.event === "QueueParams") {
                
                // queueParams.push(item);
            }else if (item.event === "QueueMember"){
                // queueMember.push(item);
            }else if (item.event === "QueueEntry"){
                // console.log(item);
                let ext = item.channel.split('/')[1]
                ext = ext.split('@')[0]
                var antrian = {
                    'channel': item.channel,
                    'position': item.position,
                    'wait': item.wait,
                    'extension': ext
                }
                queueEntry.push(antrian);
            }
        }
        // console.log(queueEntry);
        var results = {
            status: notif,
            total_entri: queueEntry.length,
            entries: queueEntry,
        }
    }else{
        var results = {
            status: {
                'response': 'Failed',
                'eventlist': null,
                'message': 'something wrong'
            },
            total_entri: 0,
            entries: [],
        }
    }
    
    return res.status(200).json(results)
}
