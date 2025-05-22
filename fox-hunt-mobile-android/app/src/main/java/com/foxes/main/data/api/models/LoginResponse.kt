package com.foxes.main.data.api.models

data class LoginResponse(
    val token: String,
    val refreshToken: String,
    val expiresInSeconds: String,
    val tokenType: String,
)