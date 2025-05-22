package com.foxes.main.presentation.onboarding

import com.foxes.BuildConfig
import com.foxes.main.presentation.base.ViewModel
import com.foxes.main.data.datasource.PreferencesDataSource
import toothpick.InjectConstructor


@InjectConstructor
class OnboardingViewModel(private val preferences: PreferencesDataSource) : ViewModel {

    fun isFirstLaunch(): Boolean {
        return preferences.appVersion < BuildConfig.VERSION_CODE
    }
}