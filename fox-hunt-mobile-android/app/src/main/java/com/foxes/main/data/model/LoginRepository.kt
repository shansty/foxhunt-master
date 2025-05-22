package com.foxes.main.data.model

import com.foxes.main.data.api.LoginApi
import com.foxes.main.data.api.models.LoginResponse
import com.foxes.main.data.datasource.PreferencesDataSource
import toothpick.InjectConstructor

@InjectConstructor
class LoginRepository(
    private val loginApi: LoginApi,
    private val preferences: PreferencesDataSource,
) {
    var user: LoginResponse?
        get() = preferences.loginResponse
        set(value) {
            preferences.loginResponse = value
        }

    suspend fun login(email: String, password: String, domain: String) {
        val response = LoginResponse("","","","",)
        preferences.loginResponse = response
    }
}