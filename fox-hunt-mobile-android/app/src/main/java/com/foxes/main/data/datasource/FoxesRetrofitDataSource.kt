package com.foxes.main.data.datasource

import com.foxes.main.domain.Coordinate
import com.foxes.main.domain.Fox
import com.foxes.main.domain.FoxesDataSource
import toothpick.InjectConstructor

@InjectConstructor
class FoxesRetrofitDataSource: FoxesDataSource {
    override fun getFoxes(): List<Fox> = listOf(
        Fox("F1", Coordinate(37.7452, -122.4424), 3.47f, 10_000),
        Fox("F2", Coordinate(37.5582, -122.1767), 3.53f, 10_000),
        Fox("F3", Coordinate(37.3477, -122.4002), 3.50f, 10_000),
    )
}