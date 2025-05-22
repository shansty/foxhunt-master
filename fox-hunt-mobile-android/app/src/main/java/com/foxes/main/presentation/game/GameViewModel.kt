package com.foxes.main.presentation.game

import android.location.Location
import android.os.CountDownTimer
import com.foxes.main.data.datasource.LocationDataSource
import com.foxes.main.data.datasource.VolumeDataSource
import com.foxes.main.domain.Coordinate
import com.foxes.main.domain.Fox
import com.foxes.main.domain.FoxesDataSource
import com.foxes.main.domain.Game
import com.foxes.main.presentation.base.ViewModel
import com.foxes.main.presentation.game.model.FloatRange
import com.foxes.main.presentation.game.model.Time
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch
import toothpick.InjectConstructor


@InjectConstructor
class GameViewModel(
    scope: CoroutineScope,
    private val locationDataSource: LocationDataSource,
    private val foxesDataSource: FoxesDataSource,
    private val volumeDataSource: VolumeDataSource,
) : ViewModel {
    val isFoxFound = MutableStateFlow(
        foxesDataSource.getFoxes().associateWith { false }
    )
    val volume: Flow<Int> = volumeDataSource.volumeFlow
    val timeLeft = MutableSharedFlow<Time>(1, 1)
    val gameFinished = MutableSharedFlow<Any>(1, 1)
    private val timer: CountDownTimer

    val frequency = MutableSharedFlow<Float>(1, 1)
    val foxSignalFound = MutableStateFlow<Fox?>(null)
    val foxVolumes = MutableSharedFlow<Map<Fox, Float>>(1, 1)
    val frequencyRange = MutableSharedFlow<FloatRange>(1, 1)

    val foxes = MutableStateFlow(foxesDataSource.getFoxes())

    init {
        scope.launch {
            locationDataSource.userCoordinates.collect(::onUserLocationChanged)
        }
        val game = Game(1671641692217, 45000L)
        val timePassed = System.currentTimeMillis() - game.startTime

        timer = object : CountDownTimer(game.duration - timePassed, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                timeLeft.tryEmit(LongToTimeMapper.map(millisUntilFinished))
            }

            override fun onFinish() {
                cancel()
                gameFinished.tryEmit(Unit)
            }
        }

        if (timePassed < game.duration) {
            timer.start()
        }

        val range = FloatRange(3.35f, 3.65f)
        frequencyRange.tryEmit(range)
        setFrequency(range.from)

        FoxBroadcaster(scope, frequency, foxesDataSource.getFoxes(), 5000)
            .subscribe(foxSignalFound::tryEmit)
    }

    override fun clear() {
        timer.cancel()
    }

    private suspend fun onUserLocationChanged(coordinate: Coordinate) {
        foxesDataSource.getFoxes().forEach { fox ->
            if (fox.coordinate.contains(coordinate, FOX_FOUND_RADIUS)) {
                val foundState = isFoxFound.value.toMutableMap()
                isFoxFound.emit(foundState.apply { set(fox, true) })
            }
        }
        foxesDataSource.getFoxes()
            .associateWith { fox -> fox.calculateVolume(coordinate) }
            .let(foxVolumes::tryEmit)
    }

    private fun Fox.calculateVolume(
        userCoordinate: Coordinate
    ) = when {
        coordinate.contains(userCoordinate, FOX_FOUND_RADIUS) -> 1f
        coordinate.contains(userCoordinate, area) -> {
            val rBig = area - FOX_FOUND_RADIUS
            val rSmall = FloatArray(1).also { results ->
                Location.distanceBetween(
                    coordinate.latitude, coordinate.longitude,
                    userCoordinate.latitude, userCoordinate.longitude,
                    results
                )
            }.first()
            FOX_MIN_VOLUME + (1 - FOX_MIN_VOLUME) * (area - rSmall) / rBig
        }
        else -> FOX_MIN_VOLUME
    }

    private fun Coordinate.contains(
        coordinate: Coordinate,
        radius: Int
    ): Boolean {
        val results = FloatArray(1)
        Location.distanceBetween(
            coordinate.latitude, coordinate.longitude, latitude, longitude, results
        )
        return radius > results.first()
    }

    fun onPermissionsGranted() {
        locationDataSource.onPermissionsGranted()
    }

    fun setVolume(value: Float) {
        volumeDataSource.setVolume(value.toInt())
    }

    fun setFrequency(value: Float) {
        val newFrequency = "%.2f".format(value).toFloat()
        frequency.tryEmit(newFrequency)
    }

    companion object {
        private const val FOX_FOUND_RADIUS = 3000
        private const val FOX_MIN_VOLUME = 0.05f
    }
}