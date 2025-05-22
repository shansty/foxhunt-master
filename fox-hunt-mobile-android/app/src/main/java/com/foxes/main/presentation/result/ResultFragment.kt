package com.foxes.main.presentation.result

import androidx.navigation.fragment.findNavController
import com.foxes.R
import com.foxes.databinding.FragmentResultBinding
import com.foxes.main.presentation.base.BaseFragment
import com.foxes.main.presentation.base.utils.observeFlow
import toothpick.InjectConstructor

@InjectConstructor
class ResultFragment(
    override val viewBinding: FragmentResultBinding,
    override val viewModel: ResultViewModel,
) : BaseFragment() {

    init {
        viewModel.result.observeFlow(this) { result ->
            viewBinding.run {
                foxes.text = resources.getString(R.string.result_foxes, result.foundFoxes, result.totalFoxes)
                time.text = resources.getString(R.string.result_time, result.timeInGame)
            }
        }
        viewBinding.close.setOnClickListener {
            findNavController().navigate(
                ResultFragmentDirections.actionResultFragmentToBottomNavigationFragment()
            )
        }
    }
}