import { expireToken } from "../redux/userSlice"

export const handleRequestError = async (dispatch, err) => {
    console.log(err.response.status)
    if(err.response.status===401) {
        dispatch(expireToken())
    }
}