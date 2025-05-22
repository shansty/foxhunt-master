package com.foxes.main.presentation.game.settings

import android.content.Context
import androidx.navigation.fragment.findNavController
import com.foxes.databinding.FragmentGameSettingsBinding
import com.foxes.main.presentation.base.BaseFragment
import com.foxes.main.presentation.base.utils.observeFlow
import toothpick.InjectConstructor

@InjectConstructor
class GameSettingsFragment(
    override val viewBinding: FragmentGameSettingsBinding,
    override val viewModel: GameSettingsViewModel,
) : BaseFragment() {

    init {
        viewBinding.start.setOnClickListener {
            viewModel.onOnboardingFinished()
        }
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        viewModel.onPopUpToBottomNavScreen.observeFlow(this) {
            findNavController().navigate(
                GameSettingsFragmentDirections.actionPopUpGameSettingsToBottomNavFragment()
            )
        }
        viewModel.onOpenBottomNavScreen.observeFlow(this) {
            findNavController().navigate(
                GameSettingsFragmentDirections.actionGameSettingsToBottomNavFragment()
            )
        }
    }
}