let IS_PROD = true;
const server = IS_PROD
  ? "https://acetogetherbackend.onrender.com"
  : "http://localhost:3000";

export default server;
