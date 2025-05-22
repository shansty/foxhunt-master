package com.foxes.main.presentation.result

import com.foxes.main.data.api.GameResultApi
import com.foxes.main.data.api.models.GameFinishResponse
import com.foxes.main.presentation.base.ViewModel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.launch
import toothpick.InjectConstructor

@InjectConstructor
class ResultViewModel(
    scope: CoroutineScope,
    private val gameResultApi: GameResultApi,
) : ViewModel {
    val result = MutableSharedFlow<GameFinishResponse>(1, 1)

    init {
        scope.launch {
            runCatching {
                gameResultApi.finish()
            }.onSuccess {
                result.tryEmit(it)
            }
        }
    }
}