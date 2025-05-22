package com.foxes.main.di.module

import com.foxes.main.data.datasource.FoxesRetrofitDataSource
import com.foxes.main.data.datasource.mock.MockDataSource
import com.foxes.main.domain.FoxesDataSource
import com.foxes.main.presentation.game.GameViewModel
import toothpick.ktp.binding.bind
import toothpick.ktp.binding.module

fun gameModule(
    mockConfig: MockDataSource.Config? = null,
) = module {
    bind<GameViewModel>().singleton()
    if (mockConfig == null) {
        bind<FoxesDataSource>().toClass(FoxesRetrofitDataSource::class)
    } else {
        bind<FoxesDataSource>().toProviderInstance { MockDataSource(mockConfig) }
    }
}