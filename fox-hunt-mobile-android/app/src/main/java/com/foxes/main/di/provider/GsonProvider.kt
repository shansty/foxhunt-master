package com.foxes.main.di.provider

import com.foxes.main.di.AppDependencies
import com.google.gson.Gson
import toothpick.InjectConstructor
import javax.inject.Provider

@InjectConstructor
class GsonProvider(
    private val appDependencies: AppDependencies,
) : Provider<Gson> {
    override fun get(): Gson {
        return appDependencies.gson
    }
}