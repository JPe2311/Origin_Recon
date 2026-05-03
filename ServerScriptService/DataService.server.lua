local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")

local DataService = {}
DataService.__index = DataService

DataService.DEFAULT_PROFILE = {
    Points = 0,
    SecurityLevel = 1,
    Streak = 0,
    Tokens = 0,
    CompletedMissions = {},
    LastDaily = 0,
}

DataService._profiles = {}
DataService._store = DataStoreService:GetDataStore("PlayerProgress")

local function cloneDefaults()
    local copy = {}
    for key, value in pairs(DataService.DEFAULT_PROFILE) do
        if type(value) == "table" then
            local clonedTable = {}
            for index, item in ipairs(value) do
                clonedTable[index] = item
            end
            copy[key] = clonedTable
        else
            copy[key] = value
        end
    end
    return copy
end

function DataService:_hydrate(profile)
    local hydrated = cloneDefaults()

    for key, value in pairs(profile) do
        if key == "CompletedMissions" and type(value) == "table" then
            local missions = {}
            for index, mission in ipairs(value) do
                missions[index] = mission
            end
            hydrated.CompletedMissions = missions
        elseif hydrated[key] ~= nil then
            hydrated[key] = value
        end
    end

    if hydrated.LastDaily == nil then
        hydrated.LastDaily = 0
    end

    return hydrated
end

function DataService:Load(player)
    local key = string.format("player_%d", player.UserId)
    local success, data = pcall(function()
        return self._store:GetAsync(key)
    end)

    if not success then
        warn(string.format("[DataService] No se pudo cargar el perfil de %s: %s", player.Name, tostring(data)))
    end

    local isFirstSession = not success or type(data) ~= "table"
    local profile

    if not success or type(data) ~= "table" then
        profile = cloneDefaults()
    else
        profile = self:_hydrate(data)
    end

    self._profiles[player] = profile
    return profile, isFirstSession
end

function DataService:Save(player)
    local profile = self._profiles[player]
    if not profile then
        return false
    end

    local key = string.format("player_%d", player.UserId)
    for attempt = 1, 3 do
        local success, errorMessage = pcall(function()
            self._store:SetAsync(key, profile)
        end)

        if success then
            return true
        end

        warn(string.format("[DataService] Intento %d fallido al guardar %s: %s", attempt, player.Name, tostring(errorMessage)))
        task.wait(2 ^ attempt)
    end

    return false
end

function DataService:SaveAll()
    for player in pairs(self._profiles) do
        self:Save(player)
    end
end

function DataService:ApplyToPlayer(player)
    local profile = self._profiles[player]
    if not profile then
        return
    end

    local leaderstats = player:FindFirstChild("leaderstats")
    if not leaderstats then
        leaderstats = Instance.new("Folder")
        leaderstats.Name = "leaderstats"
        leaderstats.Parent = player
    end

    local function ensureStat(name, className, value)
        local stat = leaderstats:FindFirstChild(name)
        if not stat then
            stat = Instance.new(className)
            stat.Name = name
            stat.Parent = leaderstats
        end
        stat.Value = value
    end

    ensureStat("Points", "IntValue", profile.Points)
    ensureStat("SecurityLevel", "IntValue", profile.SecurityLevel)
    ensureStat("Streak", "IntValue", profile.Streak)
    ensureStat("Tokens", "IntValue", profile.Tokens)

    player:SetAttribute("CompletedMissionsCount", #profile.CompletedMissions)
    player:SetAttribute("LastDaily", profile.LastDaily)
end

local function onPlayerAdded(player)
    local profile, isFirstSession = DataService:Load(player)

    if isFirstSession then
        profile.LastDaily = 0
        DataService._profiles[player] = profile
    end

    DataService:ApplyToPlayer(player)
end

local function onPlayerRemoving(player)
    DataService:Save(player)
    DataService._profiles[player] = nil
end

Players.PlayerAdded:Connect(onPlayerAdded)
Players.PlayerRemoving:Connect(onPlayerRemoving)

game:BindToClose(function()
    DataService:SaveAll()
end)

return DataService
