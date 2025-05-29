import {createClient} from 'redis'

const client = createClient();

client.on('connect', () => console.log('Redis client connected'));
client.on('error', err => console.log('Redis Client Error', err));

await client.connect();  

export default client;