importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.js')

self.addEventListener('install', function (event) {
    self.skipWaiting();
});

self.addEventListener('activate', event => {

});

updateDelivery();

self.addEventListener('push', event => {
    let notificationData = event.data.json();
    let notificationID;

    notificationData.isPushNotification = true;
    event.waitUntil(async function () {
        const activeClient = await getVisibleClient();
        if (activeClient) {
            let scopeCheck = await checkScope(activeClient);
            if (scopeCheck) {
                postMessageToWindow(activeClient, notificationData)
            } else {
                await showNotification(notificationData.notification, notificationData.data)
            }
        } else {
            await showNotification(notificationData.notification, notificationData.data)
        }
        if (notificationData.data && notificationData.data.message_id) {
            notificationID = notificationData.data.message_id;
            await updateDeliveryInDb(notificationID);
        }
    }());
});

self.addEventListener('notificationclick', function (event) {

    const notification = event.notification;
    event.waitUntil(async function () {
        let navigateUrl = "";
        let triggeredAction = "";
        if (notification.actions && notification.actions[0] && event.action === notification.actions[0].action) {
            updateActionToIndexDB(notification, notification.data.actions[0].target);
            triggeredAction = notification.data.actions[0].action;
            navigateUrl = notification.data.action1;
            notification.close();
        } else if (notification.actions && notification.actions[1] && event.action === notification.actions[1].action) {
            updateActionToIndexDB(notification, notification.data.actions[1].target);
            triggeredAction = notification.data.actions[1].action;
            navigateUrl = notification.data.action2;
            notification.close();
        } else {
            navigateUrl = notification.data.click_action;
            notification.close();
        }
        if (notification.data && notification.data.notificationID) {
            updateClickToDb(notification.data.notificationID);
        }

        if (notification.data && notification.data.isLink) {
            clients.openWindow(navigateUrl);
        } else {
            const allClients = await getClientList();
            if (allClients.length > 0) {
                const activeClient = await getVisibleClient();
                let data = {
                    path: navigateUrl
                };

                if (activeClient) {
                    let scopeCheck = await checkScope(activeClient);
                    if (scopeCheck) {
                        activeClient.focus();
                        insertSeletctedTarget(navigateUrl, triggeredAction, notification)
                        postMessageToWindow(activeClient, data);
                    } else {
                        let navigated = false;
                        for (var i = 0; i < allClients.length; i++) {
                            let clientFind = await checkScope(allClients[i]);
                            if (clientFind) {
                                navigated = true;
                                allClients[i].focus();
                                insertSeletctedTarget(navigateUrl, triggeredAction, notification)
                                postMessageToWindow(allClients[i], data);
                                break;
                            }
                        }
                        if (!navigated) {
                            let registeredUrl = await getRegisteredUrl();
                            clients.openWindow(registeredUrl);
                            insertSeletctedTarget(navigateUrl, triggeredAction, notification)
                        }
                    }
                } else {
                    insertSeletctedTarget(navigateUrl, triggeredAction, notification)
                    let navigated = false;
                    for (var i = 0; i < allClients.length; i++) {
                        let clientFind = await checkScope(allClients[i]);
                        if (clientFind) {
                            navigated = true;
                            allClients[i].focus();
                            postMessageToWindow(allClients[i], data);
                            break;
                        }
                    }
                    if (!navigated) {
                        let registeredUrl = await getRegisteredUrl();
                        clients.openWindow(registeredUrl);
                        insertSeletctedTarget(navigateUrl, triggeredAction, notification)
                    }
                }
            } else {
                let registeredUrl = await getRegisteredUrl();
                clients.openWindow(registeredUrl);
                insertSeletctedTarget(navigateUrl, triggeredAction, notification);
            }
        }

    }());

});

async function showNotification(notification, dataNotification) {
    const notificationTitle = notification.title;
    const notificationOptions = {
        actions: dataNotification.actions ? JSON.parse(dataNotification.actions) : [],
        badge: dataNotification.badge,
        body: notification.body,
        data: dataNotification.data ? dataNotification.data : {},
        icon: notification.icon,
        image: notification.image,
        requireInteraction: true
    };
    let clickUrl;
    let isLink = false;

    if (dataNotification.sym) {
        notificationOptions.data.sym = dataNotification.sym;
    }

    if (dataNotification.click_action) {
        clickUrl = await getActionValue(dataNotification.click_action);
        if (clickUrl === "" || clickUrl === undefined) {
            clickUrl = dataNotification.click_action;
            isLink = true;
        }
    } else {
        clickUrl = await getRegisteredUrl();
    }

    notificationOptions.data.click_action = clickUrl;
    notificationOptions.data.notificationID = dataNotification.message_id;
    notificationOptions.data.isLink = isLink;
    notificationOptions.data.actions = notificationOptions.actions;

    if (typeof notificationOptions.actions[0] !== 'undefined') {
        notificationOptions.data.action1 = await getActionValue(notificationOptions.actions[0].target);
    }
    if (typeof notificationOptions.actions[1] !== 'undefined') {
        notificationOptions.data.action2 = await getActionValue(notificationOptions.actions[1].target);
    }

    return self.registration.showNotification(notificationTitle,
        notificationOptions).then(() => self.registration.getNotifications())
        .then(notifications => {
            if (Number(dataNotification.expiry) != 0) {
                setTimeout(() => notifications.forEach(shownNotification => shownNotification.close()),
                    dataNotification.expiry ? dataNotification.expiry : 1000);
            }
        }).catch((error) => {

        });
}


async function getDbConnection() {
    return await new Promise((resolve, reject) => {
        let openRequest = indexedDB.open("shield", 1);
        openRequest.onerror = function () {
            reject();
        };

        openRequest.onsuccess = function () {
            resolve(openRequest.result);
        };

        openRequest.onupgradeneeded = function () {

            openRequest.result.createObjectStore("goalnotifications", { keyPath: "action" });

            openRequest.result.createObjectStore("configs", { keyPath: "appID" });

            openRequest.result.createObjectStore("actions", { keyPath: "action" });

            openRequest.result.createObjectStore("receivednotifications", { keyPath: "notificationID" });

            openRequest.result.createObjectStore("selectedTarget", { keyPath: "actionPath" });

        };

    });
}

async function insertSeletctedTarget(url, action, notification) {
    let data = {
        actionPath: url,
    }
    if (action)
        data.action = action
    if (notification?.data?.sym)
        data.sym = notification?.data?.sym

    let db = await this.getDbConnection();
    await new Promise((resolve, reject) => {
        let transStore = db.transaction(["selectedTarget"], "readwrite");
        let configStore = transStore.objectStore("selectedTarget");
        configStore.clear();
        configStore.put(data);
    })
}

async function updateDeliveryInDb(notificationID) {
    let notification = {
        notificationID: notificationID,
        deliveredAt: getCurrentGMTEpocTime(),
        isClicked: false,
        clickedAt: null
    };
    let db = await getDbConnection();
    await new Promise((resolve, reject) => {
        let transStore = db.transaction(["receivednotifications"], "readwrite");
        let receivedStore = transStore.objectStore("receivednotifications");
        receivedStore.put(notification);
        db.close();
    });
}

async function updateClickToDb(notificationID) {
    let db = await getDbConnection();
    await new Promise((resolve, reject) => {
        let transStore = db.transaction(["receivednotifications"], "readwrite");
        let receivedStore = transStore.objectStore("receivednotifications");
        let allNotifications = receivedStore.getAll();
        allNotifications.onsuccess = () => {
            let receivedNotifications = allNotifications.result;
            if (receivedNotifications.length) {
                let request = receivedStore.get(notificationID);
                request.onsuccess = () => {
                    let notificatioObj = request.result;
                    if (notificatioObj) {
                        notificatioObj.isClicked = true;
                        notificatioObj.clickedAt = getCurrentGMTEpocTime()
                        receivedStore.put(notificatioObj);
                    }
                    db.close();
                }
            } else {
                let notification = {
                    notificationID: notificationID,
                    deliveredAt: 0,
                    isClicked: true,
                    clickedAt: getCurrentGMTEpocTime()
                };
                receivedStore.put(notification);
                db.close();
            }
        }
        allNotifications.onerror = () => {
            db.close();
        }
    });
}

async function getConfigValues() {
    let db = await getDbConnection();
    let configVal = await new Promise((resolve, reject) => {
        let transStore = db.transaction(["configs"], "readwrite");
        let configStore = transStore.objectStore("configs");
        let configs = configStore.getAll();
        configs.onsuccess = () => {
            db.close();
            resolve(configs.result[0]);
        }
        configs.onerror = () => {
            db.close();
        }
    });
    return configVal;
}

//Routing handles here
async function getActionValue(action) {
    let db = await getDbConnection();
    const url = await new Promise((resolve, reject) => {
        var transaction = db.transaction(["actions"]);
        var objectStore = transaction.objectStore("actions");
        var request = objectStore.get(action);

        request.onerror = function (event) {
            db.close();
            reject();
        };
        request.onsuccess = async function (event) {
            let registeredUrl = await getRegisteredUrl();
            if (typeof request.result === 'undefined') {
                db.close();
                resolve('');
                return;
            }
            db.close();
            const activeClient = await getVisibleClient();
            let completeURL;
            if (activeClient) {
                completeURL = request.result.url;
            } else {
                completeURL = request.result.url;
            }

            resolve(completeURL);
        }
    });

    return url;
}

async function updateActionToIndexDB(notification, action) {
    let config = await getConfigValues();
    let body = {
        appID: config.appID,
        notificationID: notification.data.notificationID,
        notificationData: {
            actions: notification.data.actions,
            badge: notification.badge,
            body: notification.body,
            click_action: notification.data.click_action,
            image: notification.image,
            icon: notification.icon,
            lang: notification.lang,
            renotify: notification.renotify,
            requireInteraction: notification.requireInteraction,
            silent: notification.silent,
            tag: notification.tag,
            timestamp: notification.timestamp,
            title: notification.title,
            vibrate: notification.vibrate
        },
        action: action
    };
    let db = await getDbConnection();
    let transStore = db.transaction(["goalnotifications"], "readwrite");
    let notifyStore = transStore.objectStore("goalnotifications");

    notifyStore.put(body);
    db.close();

}

function parseJson(response) {
    response = response.response;
    if (response.infoID !== "0") {
        var msg = response.infoMsg;
        var error = new Error(msg);
        error.infoID = response.infoID;
        error.data = response.data
        throw error;
    }
    return response;
}

function getCurrentGMTEpocTime() {
    let gmtTime = new Date().toGMTString();
    return new Date(gmtTime).getTime();
}

// updates for every 2 mins
async function updateDelivery() {
    let config = await getConfigValues();

    let deliveryIntervalTime = config.deliveryInterval ? Number(config.deliveryInterval) : 120000;

    setInterval(async () => {
        let db = await getDbConnection();
        if (db) {
            const notifications = await new Promise((resolve, reject) => {
                var transaction = db.transaction(["receivednotifications"], "readwrite");
                var objectStore = transaction.objectStore("receivednotifications");
                var request = objectStore.getAll();

                request.onerror = function (event) {
                    reject();
                };
                request.onsuccess = function (event) {
                    let data = request.result;
                    resolve(data);
                }
            });

            if (notifications.length > 0) {

                let updateDeliveryApi = `${config.baseUrl}/Device/NotifyUpdate/1.0.0`;

                let requestData = {
                    request: {
                        data: {
                            notifications: notifications
                        },
                        appID: config.appID
                    }
                };
                fetchApi(updateDeliveryApi, requestData, () => {
                    var transaction = db.transaction(["receivednotifications"], "readwrite");
                    var objectStore = transaction.objectStore("receivednotifications");
                    objectStore.clear();
                    db.close();
                }, (error) => {
                    db.close();
                })
            }
        }
    }, deliveryIntervalTime);
}


async function fetchApi(url, data, successCallback, errorCallback) {
    let config = await getConfigValues();
    let isEncryptEnabled = config.encryptionEnabled;
    let reqData = JSON.stringify({});
    if (data) {
        if (isEncryptEnabled)
            reqData = await encrypt(JSON.stringify(data))
        else
            reqData = JSON.stringify(data);
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: reqData
    }).then((response) => {
        return response.text();
    }).then((body) => {
        if (successCallback) {
            if (isEncryptEnabled) {
                decrypt(body).then(decryptResp => {
                    successCallback(parseJson(JSON.parse(decryptResp)));
                })
            } else {
                successCallback(parseJson(JSON.parse(body)));
            }
        }
    }).catch((error) => {
        if (errorCallback)
            errorCallback(error)
    });
}

async function getVisibleClient() {
    let allClients = await getClientList();
    for (var i = 0; i < allClients.length; i++) {
        if (allClients[i].visibilityState === 'visible') {
            return allClients[i]
        }
    }
}

async function getClientList() {
    return self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    });
}

async function postMessageToWindow(client, message) {

    attemptToMessageClient(client, message);
}

async function attemptToMessageClient(client, message) {
    if (client) {
        client.postMessage(message);
    }
}

async function checkScope(activeClient) {
    if (activeClient && activeClient.url) {
        let registration = await self.registration;
        if (registration && activeClient.url.startsWith(registration.scope)) {
            return true;
        }
    }
    return false;
}

async function getRegisteredUrl() {
    let registration = await self.registration;
    return registration.scope;
}

// Encrypt Decrypt 

async function getEncryptionKey() {
    let configData = await getConfigValues();
    return configData.encryptionKey;
}

const getKey = (key) => {
    var wordArray = CryptoJS.enc.Utf8.parse(key);
    var skey = CryptoJS.enc.Base64.stringify(wordArray);

    var ekey = CryptoJS.enc.Base64.parse(skey);
    var eiv = CryptoJS.enc.Base64.parse(skey);

    return { ekey, eiv }
}

const encrypt = (value) => {
    return getEncryptionKey().then(function (res) {
        var { ekey, eiv } = getKey(res)

        var edata = CryptoJS.AES.encrypt(value, ekey, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: eiv });
        return edata.ciphertext.toString(CryptoJS.enc.Base64);
    })
}

const decrypt = (value) => {
    return getEncryptionKey().then(function (res) {
        var { ekey, eiv } = getKey(res)

        var bytes = CryptoJS.AES.decrypt(value, ekey, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: eiv });
        return bytes.toString(CryptoJS.enc.Utf8);
    })
}