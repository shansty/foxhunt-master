package com.foxes.main.presentation.competitions.viewpager

import androidx.fragment.app.Fragment
import androidx.viewpager2.adapter.FragmentStateAdapter
import com.foxes.main.presentation.base.AppFragmentFactory
import com.foxes.main.presentation.competitions.Competition
import com.foxes.main.presentation.competitions.list.CompetitionsFragment
import com.foxes.main.presentation.competitions.list.CompetitionsFragmentArgs

class CompetitionsViewPagerAdapter(
    private val fragment: Fragment,
) : FragmentStateAdapter(fragment) {

    override fun getItemCount(): Int = Competition.Status.values().size

    override fun createFragment(position: Int): Fragment {
        return AppFragmentFactory().instantiate(
            fragment.requireContext().classLoader,
            CompetitionsFragment::class.java.name
        ).apply {
            arguments = CompetitionsFragmentArgs(
                status = Competition.Status.values()[position]
            ).toBundle()
        }
    }
}
