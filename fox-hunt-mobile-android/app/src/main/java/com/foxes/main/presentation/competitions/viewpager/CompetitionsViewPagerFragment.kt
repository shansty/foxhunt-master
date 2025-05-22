package com.foxes.main.presentation.competitions.viewpager

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.foxes.databinding.FragmentCompetitionsViewPagerBinding
import com.foxes.main.presentation.competitions.Competition
import com.google.android.material.tabs.TabLayoutMediator
import toothpick.InjectConstructor

@InjectConstructor
class CompetitionsViewPagerFragment(
    private val viewBinding: FragmentCompetitionsViewPagerBinding,
) : Fragment() {

    init {
        viewBinding.viewpagerCompetitions.isSaveEnabled = false
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return viewBinding.root
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        viewBinding.viewpagerCompetitions.adapter = CompetitionsViewPagerAdapter(this)


        TabLayoutMediator(
            viewBinding.tabLayout,
            viewBinding.viewpagerCompetitions
        ) { tab, p ->
            tab.text = Competition.Status.values()[p].title
        }.attach()
    }
}