const defaultState = {
    active: "default",
    list: {
        default: {
            host: "any",
            embed_id: "",
            sessionStart: 0
        },
        popout: {
            host: "any",
            embed_id: "",
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
        case "SET_POPOUT":
            state.list.popout = clone(action.payload);
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
            if (length > 2) delete state.list[action.payload];
            else state.list = clone(defaultState.list);
            break;
        default:
            break;
    }
    console.log("STATE", state);
    return state;
};
