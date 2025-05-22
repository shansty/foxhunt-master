package com.foxes.main.data.datasource

import android.content.SharedPreferences
import com.foxes.main.data.api.models.LoginResponse
import com.google.gson.Gson
import toothpick.InjectConstructor

@InjectConstructor
class PreferencesDataSource(
    private val prefs: SharedPreferences,
    private val gson: Gson,
) {
    var loginResponse: LoginResponse?
        get() {
            val tokenInfo = prefs.getString(TOKEN_INFO_KEY, "")
            return gson.fromJson(tokenInfo, LoginResponse::class.java)
        }
        set(value) {
            val json = gson.toJson(value)
            prefs.edit().putString(TOKEN_INFO_KEY, json).apply()
        }

    var appVersion: Int
        get() = prefs.getInt(APP_VERSION_KEY, 0)
        set(value) {
            prefs.edit().putInt(APP_VERSION_KEY, value).apply()
        }

    companion object {
        private const val TOKEN_INFO_KEY = "tokenInfo"
        private const val APP_VERSION_KEY = "APP_VERSION_KEY"
    }
}