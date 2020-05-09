const defaultState = {
    active: "default",
    list: {
        default: {
            host: "any",
            embed_id: "https://player.angelthump.com/?channel=fuckaudioslave",
            sessionStart: 0
        }
    }
};

const clone = obj => JSON.parse(JSON.stringify(obj));

export const views = (prevState = defaultState, action) => {
    let state = clone(prevState);
    switch (action.type) {
        case "SET_CHANNEL":
            const i = state.active;
            state.list[i] = clone(action.payload);
            break;
        case "SET_ACTIVE_VIEW":
            const index = action.payload;
            state.active = index;
            break;
        case "ADD_VIEW":
            const key = new Date().getTime();
            state.list[key] = action.payload;
            break;
        case "REMOVE_VIEW":
            const length = Object.keys(state.list).length;
            if (length > 1) delete state.list[action.payload];
            else state.list = clone(defaultState.list);
            break;
        default:
            break;
    }
    console.log("STATE", state);
    return state;
};
