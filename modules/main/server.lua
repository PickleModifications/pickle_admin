RegisterNetEvent("pickle_admin:initializePlayer", function()
    local source = source
    TriggerClientEvent("pickle_admin:initializePlayer", source, {
        identifier = GetIdentifier(source),
    })
end)