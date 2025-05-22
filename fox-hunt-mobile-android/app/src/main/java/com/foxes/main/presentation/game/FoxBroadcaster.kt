package com.foxes.main.presentation.game

import com.foxes.main.domain.Fox
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlin.time.Duration

class FoxBroadcaster(
    private val scope: CoroutineScope,
    private val frequency: Flow<Float>,
    private val foxes: List<Fox>,
    private val broadcastInterval: Long,
) {
    private var broadcastingFox = foxes.first()

    fun subscribe(onBroadcast: (fox: Fox?) -> Unit) {
        scope.launch {
            frequency.collect {
                onBroadcast(resolveFox())
            }
        }

        var index = 0
        flow<Nothing> {
            delay(Duration.ZERO)
            while (true) {
                broadcastingFox = foxes[index.rem(foxes.size)]
                onBroadcast(resolveFox())
                delay(broadcastInterval)
                index++
            }
        }.launchIn(scope)
    }

    private suspend fun resolveFox(): Fox? {
        val active = broadcastingFox.frequency == frequency.stateIn(scope).value
        return if (active) broadcastingFox else null
    }
}