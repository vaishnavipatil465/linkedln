const ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";
module.exports = {
    BASE_URL: ENV === 'dev' ? "http://localhost:3000" : process.env.BASE_URL,
}
