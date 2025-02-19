local Channels = {}

function GetRandomPlayer()
    return {
        identifier = "char:1",
        name = "John Doe"
    }
end

function SendChannelMessage(source, channel, message)
    print('SendChannelMessage', source, channel, message)
    if not Channels[channel] then 
        --return ShowNotification(source, _L("message_fail_not_channel")) 
        Channels[channel] = { messages = {} }
    end
    local nextId = 1
    for i=1, #Channels[channel].messages do
        if Channels[channel].messages[i].id >= nextId then
            nextId = Channels[channel].messages[i].id + 1
        end
    end
    local user = {
        identifier = GetIdentifier(source),
        name = GetPlayerName(source),
        role = "admin",
        image = "https://randomuser.me/api/portraits/men/"..math.random(1, 25)..".jpg"
    }
    local data = {
        id = nextId,
        user = user,
        datetime = os.time(),
        message = message,
    }
    print(json.encode(data))
    table.insert(Channels[channel].messages, data)
    TriggerClientEvent('pickle_admin:channelMessage', -1, channel, data)
end

function SendDebugChannelMessage(channel)
    if not Channels[channel] then return end
    local nextId = 1
    for i=1, #Channels[channel].messages do
        if Channels[channel].messages[i].id >= nextId then
            nextId = Channels[channel].messages[i].id + 1
        end
    end
    local data = {
        id = nextId,
        user = {
            identifier = GetRandomPlayer().identifier,
            name = GetRandomPlayer().name,
            role = "admin",
            image = "https://randomuser.me/api/portraits/men/"..math.random(1, 25)..".jpg"
        },
        datetime = os.time(),
        message = 'Hello, how can I help you? balls!',
    }
    table.insert(Channels[channel].messages, data)
    TriggerClientEvent('pickle_admin:channelMessage', -1, channel, data)
end

lib.callback.register('pickle_admin:getChatChannel', function(source, channel)
    return Channels[channel] or { messages = {} }
end)

RegisterNetEvent("pickle_admin:sendChannelMessage", function(channel, message)
    print("WHGAAAAA", channel, message)
    local source = source
    SendChannelMessage(source, channel, message)
    SetTimeout(1000, function()
        SendDebugChannelMessage(channel)
    end)
end)

Channels.staff = {
    messages = {}
}