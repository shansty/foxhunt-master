package com.foxes.main.presentation.competitions.list

import android.os.Bundle
import android.view.View
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.foxes.databinding.FragmentCompetitionsBinding
import com.foxes.main.presentation.BottomNavigationFragment
import com.foxes.main.presentation.BottomNavigationFragmentDirections
import com.foxes.main.presentation.base.BaseFragment
import com.foxes.main.presentation.base.utils.findParentFragment
import com.foxes.main.presentation.base.utils.observeFlow
import com.foxes.main.presentation.competitions.details.CompetitionDetailsFragment
import toothpick.InjectConstructor
import toothpick.ktp.KTP

@InjectConstructor
class CompetitionsFragment(
    override val viewBinding: FragmentCompetitionsBinding,
    override val viewModel: CompetitionsViewModel,
) : BaseFragment() {

    private val navArgs: CompetitionsFragmentArgs by navArgs()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        val adapter = CompetitionsItemAdapter { competition ->
            KTP.openRootScope().openSubScope(CompetitionDetailsFragment::class)
                .installModules()
            findParentFragment<BottomNavigationFragment>()
                ?.findNavController()
                ?.navigate(
                    BottomNavigationFragmentDirections
                        .actionBottomNavigationFragmentToCompetitionDetailFragment(competition)
                )
        }

        viewBinding.recyclerView.adapter = adapter
        viewModel.getCompetitions(navArgs.status).observeFlow(viewLifecycleOwner) {
            adapter.dataSet = it
        }
    }
}