package com.foxes.main.presentation.game

import com.foxes.main.presentation.game.model.Time

object LongToTimeMapper {

    fun map(millis: Long): Time {
        val hour = ((millis / 3600000) % 24).toInt()
        val minute = ((millis / 60000) % 60).toInt()
        val second = ((millis / 1000) % 60).toInt()
        return Time(hour, minute, second)
    }
}