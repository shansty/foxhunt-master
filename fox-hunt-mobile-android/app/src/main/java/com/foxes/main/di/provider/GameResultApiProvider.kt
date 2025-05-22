package com.foxes.main.di.provider

import com.foxes.main.data.api.GameResultApi
import com.foxes.main.data.api.models.GameFinishResponse
import toothpick.InjectConstructor
import javax.inject.Provider

@InjectConstructor
class GameResultApiProvider : Provider<GameResultApi> {
    override fun get(): GameResultApi {
        return object : GameResultApi {
            override suspend fun finish(): GameFinishResponse {
                return GameFinishResponse(0, 2, "00:00")
            }
        }
    }
}