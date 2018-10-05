import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

var connectPromise = null;
const connectStomp = baseUrl => {
  if (connectPromise == null) {
    const token =
    window.localStorage.getItem("access_token") ||
    window.sessionStorage.getItem("access_token");

    const socket = new SockJS(
      `${baseUrl}/gs-guide-websocket?access_token=${token}`
    );
    const stompClient = Stomp.over(socket);

    connectPromise = new Promise((resolve, reject) => {
      console.warn('connecting')
      stompClient.connect({}, frame => { 
        resolve(stompClient);
        console.log(frame ) 
      }, err => {
        reject();
      })
    })
  }

  return connectPromise;
}

const WebSocketPlugin = {
  install(Vue, { baseUrl }) {
    const url = baseUrl || '';
    Vue.prototype.$wsubscribe = (endpoint, onmessage) => {
      connectStomp(url).then(client => {
        return client.subscribe(endpoint, message => {
          if (onmessage) {
            onmessage(JSON.parse(message.body));
          }
        });
      })
    };

    Vue.prototype.$wunsubscribe = subscription => {

    };

    Vue.prototype.$wsend = (dest, obj) => {
      connectStomp(url).then(client => {
        client.send(dest, {}, JSON.stringify(obj))
      })
    };

    Vue.prototype.$wdisconnect = () => {
      connectStomp(url).then(client => {
        client.disconnect();
      })
    }
  }
};

export default WebSocketPlugin;
