package com.foxes.main.data.api.models

data class LoginRequest(
    val email: String,
    val password: String,
    val domain: String,
)
