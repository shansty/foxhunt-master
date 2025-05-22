package com.foxes.main.presentation.game.settings

import com.foxes.BuildConfig
import com.foxes.main.presentation.base.ViewModel
import com.foxes.main.data.datasource.PreferencesDataSource
import kotlinx.coroutines.flow.MutableSharedFlow
import toothpick.InjectConstructor


@InjectConstructor
class GameSettingsViewModel(private val preferences: PreferencesDataSource) : ViewModel {

    val onOpenBottomNavScreen = MutableSharedFlow<Unit>(1, 1)
    val onPopUpToBottomNavScreen = MutableSharedFlow<Unit>(1, 1)

    fun onOnboardingFinished() {
        if (isFirstLaunch()) {
            onOpenBottomNavScreen.tryEmit(Unit)
        } else {
            onPopUpToBottomNavScreen.tryEmit(Unit)
        }
        preferences.appVersion = BuildConfig.VERSION_CODE
    }

    private fun isFirstLaunch(): Boolean {
        return preferences.appVersion < BuildConfig.VERSION_CODE
    }
}