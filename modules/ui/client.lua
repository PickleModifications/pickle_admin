function GetChannelMessages(channel)
    local messages = {}
    for i = 1, #channel.messages do
        local message = channel.messages[i]
        table.insert(messages, {
            id = message.id,
            author = message.author,
            content = message.content,
            timestamp = message.timestamp
        })
    end
    return messages
end

RegisterNetEvent("pickle_admin:channelMessage", function(channel, message)
    SendNUIMessage({
        type = "receiveChannelMessage",
        channel = channel,
        message = message
    })
end)

RegisterNetEvent("pickle_admin:initializePlayer", function(data)
    
end)

RegisterNUICallback("pageLoaded", function(data, cb)
    UI_LOADED = true
    SetNuiFocus(true, true)
    cb("ok")
end)

RegisterNUICallback("fetchChannelMessages", function(data, cb)
    SetNuiFocus(true, true)
    local channel = lib.callback.await('pickle_admin:getChatChannel', false, data.channel)
    cb(channel.messages)
end)

RegisterNUICallback("sendChannelMessage", function(data, cb)
    TriggerServerEvent('pickle_admin:sendChannelMessage', data.channel, data.message)
    cb("ok")
end)