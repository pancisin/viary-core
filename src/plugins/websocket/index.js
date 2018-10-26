import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

import { guid } from '@/utils';

var connectPromise = null;
const subscriptions = {}

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
      stompClient.connect({}, frame => {
        resolve(stompClient);
      }, err => {
        console.warn('Websocket connection is probably disconnected !')
        reject(err);
      })
    })
  }

  return connectPromise;
}

const WebSocketPlugin = {
  install(Vue, { baseUrl }) {
    const url = baseUrl || '';
    Vue.prototype.$wsubscribe = (endpoint, onmessage) => {
      const subscriptionUuid = guid();

      connectStomp(url).then(client => {
        const sub = client.subscribe(endpoint, message => {
          if (onmessage) {
            onmessage(JSON.parse(message.body));
          }
        });

        subscriptions[subscriptionUuid] = sub;
      })

      return subscriptionUuid;
    };

    Vue.prototype.$wunsubscribe = subUuid => {
      const subscription = subscriptions[subUuid];

      if (subscription != null) {
        subscription.unsubscribe();
      }
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
