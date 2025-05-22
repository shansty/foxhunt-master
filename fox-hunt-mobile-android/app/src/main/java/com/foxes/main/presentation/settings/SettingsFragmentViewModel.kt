package com.foxes.main.presentation.settings

import com.foxes.main.data.model.LoginRepository
import com.foxes.main.presentation.base.ViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import toothpick.InjectConstructor

@InjectConstructor
class SettingsFragmentViewModel(
    private val loginRepository: LoginRepository,
) : ViewModel {
    val onOpenLogin = MutableSharedFlow<Unit>(1, 1)

    fun signOut() {
        loginRepository.user = null
        onOpenLogin.tryEmit(Unit)
    }
}
