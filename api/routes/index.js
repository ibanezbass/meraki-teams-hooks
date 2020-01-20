const express = require('express');
const router = express.Router();
const Queue = require('bull');
var antiDdos = {};
var q = new Queue('tickets', process.env.REDIS_URL);
const fetch = require('node-fetch');

const hooksSecret = ''; //Your Meraki Hooks secret
const teamsURL = ''; //Your Webex Teams webhooks URL
const orgId = ''; //Your Meraki OrgId

q.process(async function(job,done){
    let networkName = job.data.networkName;
    let deviceName = job.data.deviceName;
    let alertType = job.data.alertType;
    let alertData = job.data.alertData;
    let payload = { 'markdown' : `**${networkName}**</br>\n>**Device:** ${deviceName}</br>\n>**Alert Type:** ${alertType} </br>\n>**Alert Data:** ${JSON.stringify(alertData)}`};
    await sendTeamsMessage(payload)
    .then((result) => {
        console.log(result);
        setTimeout(function (){
            antiDdos[job.data.deviceName + ',' + job.data.alertType] = false;
            done();
        },300);
    });
});

var sendTeamsMessage = function(payload){
    return new Promise((resolve,reject) => {
        let options = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        console.log(JSON.stringify(payload));
        fetch(teamsURL,options)
        .then((result) => {
            resolve(result);
        })
        .catch((err) => reject(err));

    });
}
router.post('/hooks', (req,res) => {
    var data = req.body;
    if(data.sharedSecret === hooksSecret){ //Check for hooks secret
        //        createMerakiTicket(data).then((alertId) => {
        //            res.status(200);
        //            res.send();
        //        });
        if(!antiDdos[data.deviceName + ',' + data.alertType]){
            antiDdos[data.deviceName + ',' + data.alertType] = true;
            q.add(data);
        } else {
        //    console.log('Preventing DDOS. Suck it Meraki.');
        }
        res.status(200);
        res.send();
    }
    else if(data.alertId === '' && data.organizationId === orgId){ //Workaround for Meraki webhooks test bug where it doesn't send the shared key
        res.status(200)
        res.send();
    }
    else{ //reject and log unauthorized access attempts
        console.log(data);
        console.log('Unauthorized access attempt to webhooks.');
        res.status(401);
        res.send();
    }
});


module.exports = router;
