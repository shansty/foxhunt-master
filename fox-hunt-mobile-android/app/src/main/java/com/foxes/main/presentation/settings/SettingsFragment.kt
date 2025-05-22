package com.foxes.main.presentation.settings

import android.content.Context
import androidx.navigation.fragment.findNavController
import com.foxes.databinding.FragmentSettingsBinding
import com.foxes.main.presentation.BottomNavigationFragment
import com.foxes.main.presentation.BottomNavigationFragmentDirections
import com.foxes.main.presentation.base.BaseFragment
import com.foxes.main.presentation.base.utils.findParentFragment
import com.foxes.main.presentation.base.utils.observeFlow
import toothpick.InjectConstructor

@InjectConstructor
class SettingsFragment(
    override val viewBinding: FragmentSettingsBinding,
    override val viewModel: SettingsFragmentViewModel,
) : BaseFragment() {

    init {
        viewBinding.run {
            tryNow.setOnClickListener {
                findParentFragment<BottomNavigationFragment>()
                    ?.findNavController()
                    ?.navigate(
                        BottomNavigationFragmentDirections.actionBottomNavigationFragmentToGameSettingsNavGraph()
                    )
            }
            signOut.setOnClickListener {
                viewModel.signOut()
            }
        }
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        viewModel.onOpenLogin.observeFlow(this) {
            findParentFragment<BottomNavigationFragment>()
                ?.findNavController()
                ?.navigate(
                    BottomNavigationFragmentDirections.actionBottomNavigationFragmentToLoginFragment()
                )
        }
    }
}