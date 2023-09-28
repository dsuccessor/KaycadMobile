/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * http://172.20.10.8:3001 - iPhone Network
 * http://192.168.0.163:3001
 * https://kaycad-v2.onrender.com/Login
 * https://schoolportal.vercel.app
 * http://192.168.88.223:3001 - Shago Network
 * http://192.168.88.184:3001 - shago network 2
 * http://192.168.33.20:3001 - Camon C9 Network
 * http://192.168.0.163:3001 abdurahman wifi
 * @format
 */

import axios from 'axios';

export default axios.create({
  baseURL: 'https://schoolportal.vercel.app',
});
