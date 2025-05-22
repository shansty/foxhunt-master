package com.foxes.main.presentation.base

import androidx.annotation.LayoutRes
import androidx.fragment.app.Fragment

abstract class ViewModelFragment(
    @LayoutRes contentLayoutId: Int = 0,
) : Fragment(contentLayoutId) {
    protected abstract val viewModel: ViewModel

    override fun onDestroy() {
        super.onDestroy()
        if (isRemoving) {
            viewModel.clear()
        }
    }
}