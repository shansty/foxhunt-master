package com.foxes.main.data.api

import com.foxes.main.data.api.models.CompetitionResponse
import kotlinx.coroutines.flow.Flow
import retrofit2.http.GET

interface CompetitionsApi {

    @GET("competitions")
    fun getCompetitions() : Flow<CompetitionResponse>
}