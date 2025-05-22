package com.foxes.main.di.provider

import com.foxes.main.data.api.LoginApi
import com.foxes.main.di.AppDependencies
import toothpick.InjectConstructor
import javax.inject.Provider

@InjectConstructor
class LoginApiProvider(
    private val appDependencies: AppDependencies,
) : Provider<LoginApi> {
    override fun get(): LoginApi {
        return appDependencies.Network().getApi(LoginApi::class.java)
    }
}