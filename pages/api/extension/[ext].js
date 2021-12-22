import Cors from 'cors';
import amxmlFetch from "../../../lib/amxmlFetch";
import initMiddleware from "../../../lib/initMiddleware";

export default async function Extension(req, res) {
    var ext = req.query.ext;
    let results = {
        "success": false,
        "registered": false,
        "contacts": ""
    }
    const user = "client"
    const passw = "cleint123"

    // const interpace="PJSIP/"+ext
    if (req.method === "GET") {
        // const target='https://e-verify.alpabit.com:8089/amxml?action=pjsipshowendpoints';
        // const target='http://192.168.56.102:8088/amxml?action=pjsipshowaors';
        // console.log('Server Side Join Queue');
        const target = 'http://localhost:8088/amxml?action=pjsipshowendpoints';
        const responses = await amxmlFetch(target, user, passw);
        // console.log(responses);
        const response = responses['ajax-response']['response'];
        // console.log(response);
        // const notif =  response[0].generic[0]['$'];
        let item = null
        // console.log(response.length);
        // console.log(response);
        for (var i = 1; i < response.length; i++) {
            // console.log(i);
            // console.log(response[i]);
            item = response[i].generic[0]['$'];

            if (item.event === "EndpointList") {
                // console.log(item.objectname)
                if (item.objectname.trim() === ext && item.contacts !== "") {
                    console.log('------------------------------')
                    console.log(ext)

                    results = {
                        "success": true,
                        "registered": true,
                        "contacts": item.contacts
                    }
                    break;
                } else {
                    results.success = true;
                    results.registered = false;
                    results.contacts = "";

                }
            }
        }
        return res.status(200).json(results)
    } else {
        console.log(ext);
        return res.status(200).json(results)
    }
}