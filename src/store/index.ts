import { configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PERSIST_STORE_NAME } from '@/constants/app.constant'
import RtkQueryService from '@/services/RtkQueryService'
import rootReducer from './rootReducer'

const persistConfig = {
  key: PERSIST_STORE_NAME,
  keyPrefix: '',
  storage,
  whitelist: ['auth', 'theme'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer())

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(RtkQueryService.middleware),
  devTools: import.meta.env.DEV,
})

export const persistor = persistStore(store)
export type AppDispatch = typeof store.dispatch
export type { RootState } from './rootReducer'

export default store
