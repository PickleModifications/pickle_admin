window.addEventListener('DOMContentLoaded', function() {
    // fetch("https://pickle_admin/pageLoaded").then(function(response) {
    //     // PRODUCTION MODE
    // }).catch(function(error) {
    //     // DEBUG MODE
    // });
    setTimeout(function() {
        window.postMessage({
            type: "setConfig",
            config: {
                identifier: "char:1",
                serverGroups: [
                    {
                        id: "admin",
                        label: "Admin",
                    },
                    {
                        id: "user",
                        label: "User",
                    }
                ],
                permissions: [
                    {
                        id: "staffchat",
                        label: "Staff Chat",
                    },
                    {
                        id: "roles",
                        label: "Staff Chat",
                    },
                    {
                        id: "frameworkActions",
                        label: "Framework Actions",
                    },
                    {
                        id: "noclip",
                        label: "NoClip",
                    },
                    {
                        id: "godmode",
                        label: "God Mode",
                    },
                    {
                        id: "spectate",
                        label: "Spectate Player",
                    },
                    {
                        id: "teleport",
                        label: "Teleport Player",
                    },
                    {
                        id: "warn",
                        label: "Warn Player",
                    },
                    {
                        id: "kick",
                        label: "Kick Player",
                    },
                    {
                        id: "ban",
                        label: "Ban Player",
                    },
                ],
                groups: [
                    {
                        id: "role_1",
                        label: "Admin",
                        permissions: ["noclip", "godmode", "ban", "kick"],
                        acePermissions: ["businesses.create", "businesses.delete", "businesses.edit"],
                        group: "admin"
                    },
                    {
                        id: "role_2",
                        label: "Moderator",
                        permissions: ["noclip", "godmode", "kick"],
                        acePermissions: ["businesses.create", "businesses.edit", "businesses.delete", 
                            "businesses.view", "businesses.view.others"],
                        group: "admin"
                    },
                    {
                        id: "role_3",
                        label: "Trial Moderator",
                        permissions: [],
                        acePermissions: [],
                        group: "user"
                    },
                ],
                staffMembers: [
                    {
                        identifier: "char:2",
                        name: "Pickle Mods",
                        role: "role_2",
                        image: "https://picklemods.com/logo.png"
                    }
                ]
            }
        }, '*');
    }, 1000);
});

function ExecuteDebugEvent(eventName, data) {
    switch (eventName) {
        case "sendChannelMessage":
            window.postMessage({
                type: "receiveChannelMessage",
                channel: data.channel,
                message: {
                    id: Math.floor(Math.random() * 1000000),
                    user: {
                        identifier: "char:1",
                        name: "Pickle Mods",
                        role: "role_1",
                        image: "https://picklemods.com/logo_1.png"
                    },
                    datetime: Date.now() / 1000,
                    message: data.message
                }
            }, '*');
            break;
        case "setGroupOrder": 
            console.log(data);
            break;
        default: 
            console.log("Unknown event: " + eventName);
            break;
    }
}

window.addEventListener("message", function(event) {
    if (event.data.eventName) {
        ExecuteDebugEvent(event.data.eventName, event.data.data);
    }
});