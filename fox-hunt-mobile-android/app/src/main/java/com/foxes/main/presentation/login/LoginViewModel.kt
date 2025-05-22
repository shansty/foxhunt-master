package com.foxes.main.presentation.login

import com.foxes.main.data.model.LoginRepository
import com.foxes.main.presentation.base.ViewModel
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableSharedFlow
import toothpick.InjectConstructor


@InjectConstructor
class LoginViewModel(
    private val loginRepository: LoginRepository,
) : ViewModel {
    private val scope = CoroutineScope(Dispatchers.Main)

    val onAuthorized = MutableSharedFlow<Unit>(1, 1)
    val onError = MutableSharedFlow<Throwable>(extraBufferCapacity = 1)

    init {
        runCatching { loginRepository.user }
            .onFailure { onError.tryEmit(it) }
            .getOrNull()
            ?.let { onAuthorized.tryEmit(Unit) }
    }

    fun onSingInClicked(email: String, password: String, domain: String) {
        scope.launch {
            supervisorScope {
                launch(CoroutineExceptionHandler { _, exception ->
                    onError.tryEmit(exception)
                }) {
                    loginRepository.login(email, password, domain)
                    onAuthorized.tryEmit(Unit)
                }
            }
        }
    }
}