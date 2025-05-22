package com.foxes.main.data.datasource.mock

import android.location.Location
import com.foxes.main.domain.Coordinate
import com.foxes.main.domain.Fox
import com.foxes.main.domain.FoxesDataSource
import com.foxes.main.presentation.game.difficulty.GameDifficultyMode
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.SphericalUtil

class MockDataSource(
    private val config: Config,
) : FoxesDataSource {

    private val foxesCoordinates = LinkedHashSet<Coordinate>()

    init {
        generateFoxesCoordinates()
    }

    private val foxes = (1..config.difficulty.foxAmount)
        .mapIndexed { index, value ->
            Fox(
                label = "F$value",
                coordinate = foxesCoordinates.elementAt(index),
                frequency = generateFrequency(),
                area = config.difficulty.foxSearchArea,
            )
        }

    override fun getFoxes(): List<Fox> = foxes

    private fun generateFoxesCoordinates() {
        while (foxesCoordinates.size < config.difficulty.foxAmount) {
            val coordinate = generateCoordinate()
            if (foxesCoordinates.none { isTooClose(coordinate, it) }) {
                foxesCoordinates.add(coordinate)
            }
        }
    }

    private fun generateCoordinate(): Coordinate = with(config) {
        val distance = (difficulty.foxFoundArea + gpsError..difficulty.foxSearchArea)
            .random()
            .toDouble()
        val direction = (0 until 360).random().toDouble()
        val latLng = SphericalUtil.computeOffset(
            LatLng(userCoordinate.latitude, userCoordinate.longitude),
            distance,
            direction
        )
        return Coordinate(latLng.latitude, latLng.longitude)
    }

    private fun isTooClose(c1: Coordinate, c2: Coordinate): Boolean {
        val result = FloatArray(1)
        Location.distanceBetween(c1.latitude, c1.longitude, c2.latitude, c2.longitude, result)
        return result.first() <= config.difficulty.foxFoundArea
    }

    private fun generateFrequency(): Float = with(config) {
        val min = difficulty.frequency - frequencyScale / 2
        return "%.2f".format((min + Math.random() * frequencyScale)).toFloat()
    }

    class Config(
        val difficulty: GameDifficultyMode,
        val userCoordinate: Coordinate,
        val gpsError: Int = 5,
        val frequencyScale: Float = 30f / 100
    )
}