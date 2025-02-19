local initializingPlayer = false

function InitializePlayer()
    if initializingPlayer then return end
    initializingPlayer = true
    while not UI_LOADED do Wait(100) end
    initializingPlayer = false
    TriggerServerEvent("pickle_admin:initializePlayer")
end

RegisterNetEvent("pickle_admin:initializePlayer", function(data)
    SendNUIMessage({
        type = "setConfig",
        config = {
            identifier = data.identifier,
        }
    })
end)

AddEventHandler("onResourceStart", function(resource)
    if resource == GetCurrentResourceName() then
        InitializePlayer()
    end
end)