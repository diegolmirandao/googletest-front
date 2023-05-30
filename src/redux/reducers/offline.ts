import { createSlice } from '@reduxjs/toolkit'

interface RequestConfig {
    url: string
    method: string
    data: any
    params: any
}

interface queue {
    queue: {
        id: string
        actionType: string
        requestConfig: RequestConfig
    }[],
    isOnline: boolean
}

const initialState: queue = {
    queue: [],
    isOnline: true
}

const slice = createSlice({
    initialState,
    name: 'offline',
    reducers: {
        enqueue(state, action) {
            state.queue = [action.payload, ...state.queue]
        },
        dequeue(state, action) {
            state.queue = state.queue.filter(queue => queue.id !== action.payload.id)
        },
        dequeueAll(state) {
            state.queue = []
        },
        setOnlineStatus(state, action) {
            state.isOnline = action.payload
        }
    }
})

export const { enqueue, dequeue, dequeueAll, setOnlineStatus } = slice.actions

export default slice