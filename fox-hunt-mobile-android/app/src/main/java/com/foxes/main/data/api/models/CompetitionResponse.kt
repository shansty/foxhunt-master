package com.foxes.main.data.api.models

import android.icu.text.SimpleDateFormat
import java.util.*
import com.foxes.main.presentation.competitions.Competition as DomainCompetition

data class CompetitionResponse(
    val content: List<Competition>,
) {
    class Competition(
        val name: String,
        val status: String,
        val location: Location,
        val coach: Coach,
        val startDate: String,
        val participants: List<Participant>,
        val foxAmount: String,
        val hasSilenceInterval: Boolean,
        val foxDuration: String,
    )

    class Location(
        val name: String,
    )

    class Coach(
        val firstName: String,
        val lastName: String,
    )

    data class Participant(
        val firstName: String,
        val lastName: String,
    )

    companion object {
        fun Competition.toDomain() = DomainCompetition(
            name = name,
            status = DomainCompetition.Status.valueOf(status),
            location = location.name,
            date = startDate.humanReadable(),
            coach = "${coach.firstName} ${coach.lastName}",
            foxAmount = foxAmount,
            hasSilenceInterval = hasSilenceInterval,
            duration = foxDuration,
            time = startDate.humanReadableTime(),
            participants = participants.joinToString { (firstName, lastName) -> "$firstName $lastName" }
        )

        private fun String.humanReadable(): String {
            val date = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US)
                .parse(this)
            return SimpleDateFormat("yyyy MM dd", Locale.getDefault())
                .format(date)
        }

        private fun String.humanReadableTime(): String {
            val date = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US)
                .parse(this)
            return SimpleDateFormat("HH:mm", Locale.getDefault())
                .format(date)
        }
    }
}