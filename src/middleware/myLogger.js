const myLogger = store => next => action => {
    console.log("Logged Action: ", action);
    next(action);
};

export default myLogger;
