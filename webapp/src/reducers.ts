import {combineReducers} from 'redux';

import {
    VOICE_CHANNEL_ENABLE,
    VOICE_CHANNEL_DISABLE,
    VOICE_CHANNEL_USER_CONNECTED,
    VOICE_CHANNEL_USER_DISCONNECTED,
    VOICE_CHANNEL_USERS_CONNECTED,
    VOICE_CHANNEL_CONNECTED_PROFILES,
    VOICE_CHANNEL_PROFILES_CONNECTED,
    VOICE_CHANNEL_PROFILE_CONNECTED,
    VOICE_CHANNEL_USER_MUTED,
    VOICE_CHANNEL_USER_UNMUTED,
    VOICE_CHANNEL_USER_VOICE_ON,
    VOICE_CHANNEL_USER_VOICE_OFF,
} from './action_types';

const isVoiceEnabled = (state = false, action) => {
    switch (action.type) {
    case VOICE_CHANNEL_ENABLE:
        return true;
    case VOICE_CHANNEL_DISABLE:
        return false;
    default:
        return state;
    }
};

const voiceConnectedProfiles = (state = {}, action) => {
    switch (action.type) {
    case VOICE_CHANNEL_PROFILES_CONNECTED:
        return {
            ...state,
            [action.data.channelID]: action.data.profiles,
        };
    case VOICE_CHANNEL_PROFILE_CONNECTED:
        if (!state[action.data.channelID]) {
            return {
                ...state,
                [action.data.channelID]: [action.data.profile],
            };
        }
        return {
            ...state,
            [action.data.channelID]: [
                ...state[action.data.channelID],
                action.data.profile,
            ],
        };
    case VOICE_CHANNEL_USER_DISCONNECTED:
        const profiles = state[action.data.channelID] || [];
        return {
            ...state,
            [action.data.channelID]: profiles.filter((val) => val.id !== action.data.userID),
        };
    default:
        return state;
    }
};

const voiceConnectedChannels = (state = {}, action) => {
    switch (action.type) {
    case VOICE_CHANNEL_USER_CONNECTED:
        if (!state[action.data.channelID]) {
            return {
                ...state,
                [action.data.channelID]: [action.data.userID],
            };
        }
        return {
            ...state,
            [action.data.channelID]: [
                ...state[action.data.channelID],
                action.data.userID,
            ],
        };
    case VOICE_CHANNEL_USER_DISCONNECTED:
        const users = state[action.data.channelID] || [];
        return {
            ...state,
            [action.data.channelID]: users.filter((val) => val !== action.data.userID),
        };
    case VOICE_CHANNEL_USERS_CONNECTED:
        return {
            ...state,
            [action.data.channelID]: action.data.users,
        };
    default:
        return state;
    }
};

const connectedChannelID = (state = null, action) => {
    switch (action.type) {
    case VOICE_CHANNEL_USER_CONNECTED:
        if (action.data.currentUserID === action.data.userID) {
            return action.data.channelID;
        }
        return state;
    case VOICE_CHANNEL_USER_DISCONNECTED:
        if (action.data.currentUserID === action.data.userID) {
            return null;
        }
        return state;
    default:
        return state;
    }
};

const voiceUsersStatuses = (state = {}, action) => {
    switch (action.type) {
    case VOICE_CHANNEL_USER_MUTED:
        if (!state[action.data.channelID]) {
            return {
                ...state,
                [action.data.channelID]: {
                    [action.data.userID]: {
                        unmuted: false,
                        voice: false,
                    },
                },
            };
        }
        return {
            ...state,
            [action.data.channelID]: {
                ...state[action.data.channelID],
                [action.data.userID]: {
                    ...state[action.data.channelID][action.data.userID],
                    unmuted: false,
                },
            },
        };
    case VOICE_CHANNEL_USER_UNMUTED:
        if (!state[action.data.channelID]) {
            return {
                ...state,
                [action.data.channelID]: {
                    [action.data.userID]: {
                        unmuted: true,
                        voice: false,
                    },
                },
            };
        }
        return {
            ...state,
            [action.data.channelID]: {
                ...state[action.data.channelID],
                [action.data.userID]: {
                    ...state[action.data.channelID][action.data.userID],
                    unmuted: true,
                },
            },
        };
    case VOICE_CHANNEL_USER_VOICE_ON:
        if (!state[action.data.channelID]) {
            return {
                ...state,
                [action.data.channelID]: {
                    [action.data.userID]: {
                        unmuted: false,
                        voice: true,
                    },
                },
            };
        }
        return {
            ...state,
            [action.data.channelID]: {
                ...state[action.data.channelID],
                [action.data.userID]: {
                    ...state[action.data.channelID][action.data.userID],
                    voice: true,
                },
            },
        };
    case VOICE_CHANNEL_USER_VOICE_OFF:
        if (!state[action.data.channelID]) {
            return {
                ...state,
                [action.data.channelID]: {
                    [action.data.userID]: {
                        unmuted: false,
                        voice: false,
                    },
                },
            };
        }
        return {
            ...state,
            [action.data.channelID]: {
                ...state[action.data.channelID],
                [action.data.userID]: {
                    ...state[action.data.channelID][action.data.userID],
                    voice: false,
                },
            },
        };
    default:
        return state;
    }
};

export default combineReducers({
    isVoiceEnabled,
    voiceConnectedChannels,
    connectedChannelID,
    voiceConnectedProfiles,
    voiceUsersStatuses,
});
