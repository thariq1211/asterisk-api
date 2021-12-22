import amxmlFetch from "../../lib/amxmlFetch";

export default async function QueueStatus(req, res) {
    if (req.method === "GET") {
        const query = req.body;
        console.log(req.body);
        let queueParams = [];
        let queueMember = [];
        let queueEntry = [];
        // const params = query.params.replace(/;/g,'&')
        const target = 'http://127.0.0.1:8088/amxml?action=QueueStatus'
        // console.log('Server Side Join Queue');
        let result = await amxmlFetch(target, query.user, query.passw);
        const response = result['ajax-response']['response'];
        const notif = response[0].generic[0]['$'];
        let item = null
        for (var i = 1; i < response.length; i++) {
            item = response[i].generic[0]['$'];
            if (item.event === "QueueParams") {
                console.log(item);
                queueParams.push(item);
            } else if (item.event === "QueueMember") {
                queueMember.push(item);
            } else if (item.event === "QueueEntry") {
                queueEntry.push(item);
            }
        }
        console.log(notif);
        var results = {
            status: notif,
            members: queueMember,
            params: queueParams,
            entries: queueEntry,
        }
    } else if (req.method === "POST") {
        const query = req.body;
        console.log(req.body);
        let queueParams = [];
        let queueMember = [];
        let queueEntry = [];
        // const params = query.params.replace(/;/g,'&')
        const target = 'http://127.0.0.1:8088/amxml?action=QueueStatus&queue=' + query.queue
        // console.log('Server Side Join Queue');
        let result = await amxmlFetch(target, query.user, query.passw);
        const response = result['ajax-response']['response'];
        const notif = response[0].generic[0]['$'];
        let item = null
        for (var i = 1; i < response.length; i++) {
            item = response[i].generic[0]['$'];
            if (item.event === "QueueParams") {
                console.log(item);
                queueParams.push(item);
            } else if (item.event === "QueueMember") {
                queueMember.push(item);
            } else if (item.event === "QueueEntry") {
                queueEntry.push(item);
            }
        }
        console.log(notif);
        var results = {
            status: notif,
            members: queueMember,
            params: queueParams,
            entries: queueEntry,
        }
    }
    return res.status(200).json(results);
}
