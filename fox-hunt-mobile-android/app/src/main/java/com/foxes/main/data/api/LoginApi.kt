package com.foxes.main.data.api

import com.foxes.main.data.api.models.LoginRequest
import com.foxes.main.data.api.models.LoginResponse
import retrofit2.http.Body
import retrofit2.http.POST

interface LoginApi {

    @POST("login/authentication")
    suspend fun login(@Body body: LoginRequest) : LoginResponse
}