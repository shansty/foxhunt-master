package com.foxes.main.data.api

import com.foxes.main.data.api.models.GameFinishResponse
import retrofit2.http.GET

interface GameResultApi {
    @GET("active-competitions/finish")
    suspend fun finish() : GameFinishResponse
}