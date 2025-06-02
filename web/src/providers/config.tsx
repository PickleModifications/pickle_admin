import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNuiEvent } from './nui/useNui';
import { Group, GroupMember, PermissionType } from '@/components/groups/groups';

export type Config = {
    identifier: string;
    staffMembers: GroupMember[];
    groups: Group[];
    permissions: PermissionType[];
    locale: {
        [key: string]: string;
    }
}

interface ConfigContextProps {
    config: Config;
    setConfig: (config: Config) => void;
}

const ConfigContext = createContext<ConfigContextProps | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<Config>({
        identifier: "char:1",
        locale: {
            "staffchat": "Staff Chat",
            "reports": "Reports",
            "groups": "Groups",
            "settings": "Settings",
            "logout": "Logout",
            "chat": "Chat",
            "report_title": "Report #%s",
            "report_create": "Create Report",
            "report_close": "Close Report",
            "report_submit": "Submit Report",
        },
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
                color: "#ff0000",
                permissions: ["noclip", "godmode", "ban", "kick"],
                acePermissions: ["businesses.create", "businesses.delete", "businesses.edit","businesses.create", "businesses.delete", "businesses.edit","businesses.create", "businesses.delete", "businesses.edit"],
                group: "admin"
            },
            {
                id: "role_2",
                label: "Moderator",
                color: "#ffffff",
                permissions: ["noclip", "godmode", "kick"],
                acePermissions: ["businesses.create", "businesses.edit", "businesses.delete", 
                    "businesses.view", "businesses.view.others"],
                group: "admin"
            },
            {
                id: "role_3",
                color: "#00ff00",
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
    });
    useNuiEvent('setConfig', (data) => {
        setConfig(data.config);
    });
    return (
        <ConfigContext.Provider value={{ config, setConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = (): ConfigContextProps => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};