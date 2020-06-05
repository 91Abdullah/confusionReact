import {createStore,combineReducers,applyMiddleware} from "redux";
import {initialState, Reducer} from "./reducer";
import {Dishes} from "./dishes";
import {Promotions} from "./promotions";
import {Leaders} from "./leaders";
import {Comments} from "./comments";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { createForms } from "react-redux-form";
import {InitialFeedback} from "./forms";

export const ConfigureStore = () => {
    return createStore(
        combineReducers({
            dishes: Dishes,
            promotions: Promotions,
            leaders: Leaders,
            comments: Comments,
            ...createForms({
                feedback: InitialFeedback
            })
        }),
        applyMiddleware(thunk, logger)
    );
}