package com.foxes.main.data.api.models

data class GameFinishResponse(
    val foundFoxes: Int,
    val totalFoxes: Int,
    val timeInGame: String,
)