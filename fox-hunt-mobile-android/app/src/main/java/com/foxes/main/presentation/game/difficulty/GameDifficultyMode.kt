package com.foxes.main.presentation.game.difficulty

enum class GameDifficultyMode(
    val foxSearchArea: Int,
    val duration: Int,
    val foxAmount: Int,
    val foxDuration: Int,
    val frequency: Float,
    val hasSilenceInterval: Boolean,
    val foxFoundArea: Int,
) {
    EASY(
        foxSearchArea = 100,
        duration = 30,
        foxAmount = 1,
        foxDuration = 60,
        frequency = 3.5F,
        hasSilenceInterval = false,
        foxFoundArea = 20
    ),
    NORMAL(
        foxSearchArea = 300,
        duration = 30,
        foxAmount = 3,
        foxDuration = 60,
        frequency = 3.5F,
        hasSilenceInterval = false,
        foxFoundArea = 20
    ),
    HARD(
        foxSearchArea = 500,
        duration = 30,
        foxAmount = 3,
        foxDuration = 30,
        frequency = 3.5F,
        hasSilenceInterval = true,
        foxFoundArea = 20
    ),
    ADVANCED(
        foxSearchArea = 1000,
        duration = 60,
        foxAmount = 5,
        foxDuration = 60,
        frequency = 3.5F,
        hasSilenceInterval = true,
        foxFoundArea = 20
    ),
}