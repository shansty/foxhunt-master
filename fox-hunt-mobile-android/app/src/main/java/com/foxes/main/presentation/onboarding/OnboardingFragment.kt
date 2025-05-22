package com.foxes.main.presentation.onboarding

import android.os.Bundle
import android.view.View
import android.widget.Button
import androidx.navigation.fragment.findNavController
import com.foxes.R
import com.foxes.main.di.Scope
import com.foxes.main.di.module.gameModule
import com.foxes.main.presentation.base.ViewModelFragment
import toothpick.InjectConstructor
import toothpick.ktp.KTP

@InjectConstructor
class OnboardingFragment(
    override val viewModel: OnboardingViewModel
) : ViewModelFragment(R.layout.fragment_onboarding) {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if(!viewModel.isFirstLaunch()){
            KTP.openRootScope()
                .openSubScope(Scope.GAME)
                .installModules(gameModule())
            findNavController().navigate(
                OnboardingFragmentDirections.actionOnboardingFragmentToBottomNavigationFragment()
            )
        }
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val buttonNext = view.findViewById<Button>(R.id.button_onboarding_next)
        buttonNext.setOnClickListener {
            findNavController().navigate(OnboardingFragmentDirections.actionOnboardingFragmentToGameSettingsNavGraph())
        }
    }
}