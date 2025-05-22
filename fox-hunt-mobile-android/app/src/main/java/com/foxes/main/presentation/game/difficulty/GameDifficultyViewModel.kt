package com.foxes.main.presentation.game.difficulty

import com.foxes.BuildConfig
import com.foxes.main.data.datasource.LocationDataSource
import com.foxes.main.data.datasource.PreferencesDataSource
import com.foxes.main.data.datasource.mock.MockDataSource
import com.foxes.main.di.Scope
import com.foxes.main.di.module.gameModule
import com.foxes.main.presentation.base.ViewModel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import toothpick.InjectConstructor
import toothpick.ktp.KTP


@InjectConstructor
class GameDifficultyViewModel(
    private val scope: CoroutineScope,
    private val preferences: PreferencesDataSource,
    private val locationDataSource: LocationDataSource,
) : ViewModel {

    val onOpenBottomNavScreen = MutableSharedFlow<Unit>(1, 1)
    val onPopUpToBottomNavScreen = MutableSharedFlow<Unit>(1, 1)

    fun startGame(
        difficulty: GameDifficultyMode,
    ) = scope.launch {
        locationDataSource.onPermissionsGranted()
        val userCoordinate = locationDataSource.userCoordinates.stateIn(scope).value
        if (KTP.isScopeOpen(Scope.GAME)) {
            KTP.closeScope(Scope.GAME)
        }
        KTP.openRootScope()
            .openSubScope(Scope.GAME)
            .installModules(gameModule(MockDataSource.Config(difficulty, userCoordinate)))
        onOnboardingFinished()
    }

    private fun onOnboardingFinished() {
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