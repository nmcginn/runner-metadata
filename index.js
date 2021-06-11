const core = require('@actions/core');
const axios = require('axios');

const pad = (str) => `\x1b[36m${str.data.padEnd(22, ' ')}\x1b[0m`;

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

    if (core.getInput('network') || true) {
        const [vpc, subnet, cidr] = await axios.all([
            axios.get(`${ec2}network/interfaces/macs/${mac.data}/vpc-id`),
            axios.get(`${ec2}network/interfaces/macs/${mac.data}/subnet-id`),
            axios.get(`${ec2}network/interfaces/macs/${mac.data}/vpc-ipv4-cidr-block`)
        ]);
        console.log('*    VPC Id                |  Subnet Id         |  CIDR Block               *');
        console.log(`*    ${pad(vpc)}|  ${pad(subnet)}|  ${pad(cidr)}  *`);
    }

    console.log('********************************************************************************');
}

try {
    main();
}
catch (err) {
    core.setFailed(err.message);
}
