const core = require('@actions/core');
const axios = require('axios');

const pad = (str) => str.data.padEnd(22, ' ');

async function main() {
    const ec2 = 'http://169.254.169.254/latest/meta-data/';
    const [ami, id, type, lifecycle, ip, mac] = await axios.all([
        axios.get(`${ec2}ami-id`),
        axios.get(`${ec2}instance-id`),
        axios.get(`${ec2}instance-type`),
        axios.get(`${ec2}instance-life-cycle`),
        axios.get(`${ec2}local-ipv4`),
        axios.get(`${ec2}mac`)
    ]);
    console.log('********************************************************************************');
    console.log('*    AMI Id                |  Instance Type         |  Lifecycle               *');
    console.log(`*    ${pad(ami)}|  ${pad(type)}|  ${pad(lifecycle)}  *`);
    console.log('*    Instance Id           |  IP Address            |  MAC Address             *');
    console.log(`*    ${pad(id)}|  ${pad(ip)}|  ${pad(mac)}  *`);
    console.log('********************************************************************************');
}

try {
    main();
}
catch (err) {
    core.setFailed(err.message);
}
