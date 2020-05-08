export const setChannel = data => {
    return {
        type: "SET_CHANNEL",
        payload: data
    };
};

export const setActiveView = index => {
    return {
        type: "SET_ACTIVE_VIEW",
        payload: index
    };
};

export const addView = data => {
    return {
        type: "ADD_VIEW",
        payload: data
    };
};

export const removeView = index => {
    return {
        type: "REMOVE_VIEW",
        payload: index
    };
};
