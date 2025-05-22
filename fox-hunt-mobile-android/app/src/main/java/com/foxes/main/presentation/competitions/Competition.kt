package com.foxes.main.presentation.competitions

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
class Competition(
    val name: String,
    val location: String,
    val date: String,
    val coach: String,
    val foxAmount: String,
    val time: String,
    val duration: String,
    val hasSilenceInterval: Boolean,
    val participants: String,
    val status: Status,
) : Parcelable {
    enum class Status(
        val title: String
    ) {
        FINISHED("Finished"),
        CANCELED("Cancelled");
    }
}