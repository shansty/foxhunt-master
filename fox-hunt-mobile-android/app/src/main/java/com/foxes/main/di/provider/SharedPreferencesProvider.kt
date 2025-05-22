package com.foxes.main.di.provider

import android.content.SharedPreferences
import com.foxes.main.di.AppDependencies
import toothpick.InjectConstructor
import javax.inject.Provider

@InjectConstructor
class SharedPreferencesProvider(
    private val appDependencies: AppDependencies,
) : Provider<SharedPreferences> {
    override fun get(): SharedPreferences {
        return appDependencies.sharedPreferences
    }
}