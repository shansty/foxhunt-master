package com.foxes.main.presentation.competitions.list

import com.foxes.main.data.api.CompetitionsApi
import com.foxes.main.data.api.models.CompetitionResponse.Companion.toDomain
import com.foxes.main.presentation.base.ViewModel
import com.foxes.main.presentation.competitions.Competition
import kotlinx.coroutines.flow.map
import toothpick.InjectConstructor

@InjectConstructor
class CompetitionsViewModel(
    private val competitionsApi: CompetitionsApi,
) : ViewModel {
    fun getCompetitions(status: Competition.Status) = competitionsApi.getCompetitions()
        .map { (content) ->
            content
                .map { it.toDomain() }
                .filter { it.status == status }
        }
}