package com.foxes.main.presentation.base.utils

import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

fun <T> Flow<T>.observeFlow(
    lifecycleOwner: LifecycleOwner,
    observer: (T) -> Unit
) {
    lifecycleOwner.lifecycleScope.launch {
        collectLatest(observer::invoke)
    }
}